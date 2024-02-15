import { useCallback, useState } from 'react';
import axios from 'src/api/axios';
import { Investigation } from '../types/investigation';

const useApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<Investigation[]>();
  const [item, setItem] = useState<Investigation>();
  // const search = async (query: string, chatHistory: object[]) => {
  //   const data = {
  //     query: query,
  //     chat_history: chatHistory,
  //   };
  //   try {
  //     const response = await axios.post('/score', data);
  //     if (response) {
  //       setLoading(false);
  //       return response.data;
  //     } else {
  //       console.log('No response from API');
  //     }
  //   } catch (error) {
  //     console.error('Error sending message: ', error);
  //   }
  // };

  const getItems = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get('/investigations');
      setItems(response.data.items);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setItems]);

  const getItem = useCallback(
    async (id: string): Promise<void> => {
      try {
        setLoading(true);
        const response = await axios.get(`/investigations/${id}`);
        setItem(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setItem],
  );

  const deleteItem = useCallback(
    async (id: string): Promise<void> => {
      try {
        setLoading(true);
        await axios.delete(`/investigations/${id}`);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [setLoading],
  );

  return {
    loading,
    items,
    item,
    // search,
    getItems,
    getItem,
    deleteItem,
  };
};

export default useApi;
