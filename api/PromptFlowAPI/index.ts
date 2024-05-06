import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import fetch from 'node-fetch';

const PromptFlowAPI: AzureFunction = async function (
  context: Context,
  req: HttpRequest,
): Promise<void> {
  const url =
    'https://dvasquez-seattle-vcqoi.eastus.inference.ml.azure.com/score';
  const deploymentDoc = '11';
  const deploymentReply = '12';
  const deploymentFormat = '13';

  const apiKey = '5wKEL3TxvNP6UI54WQF4vND3LI7rY8Ct';

  if (!apiKey) {
    throw new Error('A key should be provided to invoke the endpoint');
  }
  const requestHeaders = new Headers({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
    'azureml-model-deployment': `dvasquez-seattle-vcqoi-${deploymentDoc}`,
  });

  //Call the first API, fetching docs
  try {
    const responseDoc = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(req.body),
      headers: requestHeaders,
    });

    const responseBodyDoc = await responseDoc.json();

    let final_json = {};
    if ('error' in responseBodyDoc) {
      final_json = {
        reply: `First API fail ${JSON.stringify(
          responseBodyDoc,
        )} ${JSON.stringify(req.body)}`,
        search_intents: '',
        fetched_docs: [],
        current_query_intent: '',
        output_entities: [],
      };
    } else {
      const inputs = req.body;
      const input_query = inputs.query;

      //Given by the number of documents fetched let's see how many LLM reply calls we need
      let fetched_docs_json = { retrieved_documents: [] };
      try {
        const input_CH = inputs.chat_history;

        fetched_docs_json = JSON.parse(responseBodyDoc.fetched_docs[0]);

        //this should be the array ret_docs [strResultOfDocs, system_message, query_helper]
        const ret_docs_input = responseBodyDoc.fetched_docs;

        //Output related to intent
        const search_intents = responseBodyDoc.search_intents; //has relations and extra data
        const intent = responseBodyDoc.intent; //current message intent

        const documents = fetched_docs_json.retrieved_documents;

        //idea -> if all docs same type -> boom no need for comparison doc, if not -> comparison doc
        let resumeCount = 0;
        let jobCount = 0;

        //final list of strings to send LLM
        const separate_docs_to_send_in: string[] = [];

        if (documents.length > 0) {
          // string representations of json docs
          const str_docs: string[] = [];

          for (let i = 0; i < documents.length; i++) {
            if (documents[i][`[doc${i}]`]['file type'] == 'resume') {
              resumeCount += 1;
            } else {
              jobCount += 1;
            }
            str_docs.push(JSON.stringify(documents[i]));
          }

          const comparisonNeeded = resumeCount > 0 && jobCount > 0;
          const padding = comparisonNeeded ? (str_docs[0].length + 10) / 4 : 0;

          let token_estimate = padding;
          const string_beginner = comparisonNeeded ? '[' + str_docs[0] : '';
          let string_of_docs = string_beginner;

          for (let i = comparisonNeeded ? 1 : 0; i < str_docs.length; i++) {
            token_estimate += (str_docs[i].length + 5) / 4;

            if (token_estimate < 12000) {
              string_of_docs +=
                string_of_docs != string_beginner
                  ? `, ${str_docs[i]}`
                  : `[${str_docs[i]}`;
            } else {
              separate_docs_to_send_in.push(string_of_docs + ']');
              token_estimate = padding;
              string_of_docs = comparisonNeeded ? '[' + str_docs[0] : '';
              i -= 1;
            }
          }

          if (string_of_docs !== string_beginner) {
            separate_docs_to_send_in.push(string_of_docs + ']');
          }
        }

        if (separate_docs_to_send_in.length == 0) {
          separate_docs_to_send_in.push('[]');
        }

        const replies: string[] = [];
        let reply_errors = '';

        for (let i = 0; i < separate_docs_to_send_in.length; i++) {
          const these_docs = `"{"retrieved_documents": ${separate_docs_to_send_in[i]}}`;
          const this_retdocs = [
            these_docs,
            ret_docs_input[1],
            ret_docs_input[2],
          ];

          //Call the second API, calling for LLM reply
          try {
            const responseReply = await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
                'azureml-model-deployment': `dvasquez-seattle-vcqoi-${deploymentReply}`,
              } as HeadersInit,
              body: JSON.stringify({
                query: input_query,
                chat_history: input_CH,
                intent: search_intents,
                ret_docs: this_retdocs,
                current_message_intent: intent,
              }),
            });
            const responseBodyReply = await responseReply.json();
            replies.push(responseBodyReply.reply);
            reply_errors +=
              'error' in responseBodyReply
                ? JSON.stringify(responseBodyReply.error)
                : '';
          } catch (error) {
            const error_mes = `Error internal server error when generating the LLM Reply: ${error.message}`;
            context.res = {
              status: 500,
              body: error_mes,
            };
          }
        }

        if (replies.length > 0) {
          //Call the last API, formatting the reply (combining if applicable)
          try {
            const responseFormat = await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
                'azureml-model-deployment': `dvasquez-seattle-vcqoi-${deploymentFormat}`,
              } as HeadersInit,
              body: JSON.stringify({
                query: input_query,
                chat_history: input_CH,
                reply: replies,
                current_message_intent: intent,
                ret_doc: ret_docs_input,
              }),
            });
            const responseBodyFinal = await responseFormat.json();

            if ('error' in responseBodyFinal) {
              final_json = {
                reply: `Last API fail: ${JSON.stringify(
                  responseBodyFinal.error,
                )}`,
                search_intents: search_intents,
                fetched_docs: ret_docs_input,
                current_query_intent: intent,
                output_entities: '',
              };
            } else {
              final_json = {
                reply: responseBodyFinal.reply,
                search_intents: search_intents,
                fetched_docs: responseBodyFinal.fetched_docs,
                current_query_intent: intent,
                output_entities: responseBodyFinal.output_entities,
                suggested_prompts: responseBodyFinal.suggested_prompts,
              };
            }

            //this will store the final response
            context.res = {
              status: responseBodyFinal.status,
              body: final_json,
            };
          } catch (error) {
            const error_mes = `Error calling the Reply Formatting API: ${error.message}`;
            context.res = {
              status: 500,
              body: error_mes,
            };
          }
        } else {
          final_json = {
            reply: `Oh no, there are no LLM replies generated: ${reply_errors}`,
            search_intents: search_intents,
            fetched_docs: ret_docs_input,
            current_query_intent: intent,
            output_entities: '',
          };
        }
      } catch (error) {
        const error_mes = `Error within API pipeline ${error.message}`;
        console.error(error_mes);
        final_json = {
          reply: error_mes,
          search_intents: '',
          fetched_docs: [],
          current_query_intent: '',
          output_entities: [],
        };
        context.res = {
          status: 500,
          body: final_json,
        };
      }
    }

    context.res = {
      status: responseDoc.status,
      body: final_json,
    };
  } catch (error) {
    const error_mes = `Error calling the Intent + Documents API: ${error.message}`;
    console.error(error_mes);
    context.res = {
      status: 500,
      body: { reply: error_mes },
    };
  }
};

export default PromptFlowAPI;
