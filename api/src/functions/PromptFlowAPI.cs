using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using System.Reflection.Metadata;

namespace ResumeSync.Resume
{
  internal class PromptFlow
  {
    [FunctionName("PromptFlowAPI")]
    public static async Task<IActionResult> Run([HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req, ILogger log)
    {
        string url = "https://dvasquez-seattle-vcqoi.eastus.inference.ml.azure.com/score";
        string apiKey = "5wKEL3TxvNP6UI54WQF4vND3LI7rY8Ct";
        if (string.IsNullOrEmpty(apiKey))
        {
            throw new Exception("A key should be provided to invoke the endpoint");
        }

        var headers = new WebHeaderCollection();
        headers["Content-Type"] = "application/json";
        headers["Authorization"] = "Bearer " + apiKey;
        headers["azureml-model-deployment"] = "dvasquez-seattle-vcqoi-3";


        HttpWebResponse response;
        var body_content  = await new StreamReader(req.Body).ReadToEndAsync();
        Console.Write("body read");
        byte[] body = Encoding.UTF8.GetBytes(body_content);
        Console.Write("body enocoded");
        try
        {
            var request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "POST";
            request.Headers = headers;
            request.ContentLength = body.Length;
            using (var stream = request.GetRequestStream())
            {
                stream.Write(body, 0, body.Length);
            }
            Console.Write("request created");

            response = (HttpWebResponse)request.GetResponse();
            Console.Write("request response");

            var result = new StreamReader(response.GetResponseStream()).ReadToEnd();
            Console.Write("request read");
            var resultJson = JsonConvert.DeserializeObject<Dictionary<string, object>>(result);
            Console.Write("json");
            return new OkObjectResult(resultJson);
        }
        catch (WebException error)
        {
            Console.Write("ERROR");
            response = (HttpWebResponse)error.Response;
        }
        return new OkObjectResult(response);
    }

    public class Root
    {
        [JsonProperty("query")]
        public string Query { get; set; }

        [JsonProperty("chat_history")]
        public List<ChatHistoryItem> ChatHistory { get; set; }
    }

    public class ChatHistoryItem
    {
        [JsonProperty("inputs")]
        public Inputs Inputs { get; set; }

        [JsonProperty("outputs")]
        public Outputs Outputs { get; set; }
    }

    public class Inputs
    {
        [JsonProperty("query")]
        public string Query { get; set; }
    }

    public class Outputs
    {
        [JsonProperty("current_query_intent")]
        public string CurrentQueryIntent { get; set; }

        [JsonProperty("fetched_docs")]
        public List<string> FetchedDocs { get; set; }

        [JsonProperty("output_entities")]
        public string OutputEntities { get; set; }

        [JsonProperty("reply")]
        public string Reply { get; set; }

        [JsonProperty("search_intents")]
        public string SearchIntents { get; set; }
    }
  }
}
