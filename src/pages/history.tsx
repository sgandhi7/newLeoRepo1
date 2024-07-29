import { DataTable } from '@metrostar/comet-extras';
import { Button, ButtonGroup } from '@metrostar/comet-uswds';
import useApi from '@src/hooks/use-api';
import { Investigation } from '@src/types/investigation';
import { ColumnDef } from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { currentSearch as defaultSearch } from 'src/store';
import { convertToReadableFormat } from 'src/utils/utils';
import infinteLoop from '/img/infinteLoop.svg';

export const History = (): React.ReactElement => {
  const [loading, setLoading] = useState(true);
  const { getItems, deleteItem, items } = useApi();
  const [, setCurrentSearch] = useRecoilState<string>(defaultSearch);
  const [investigations, setInvestigiations] = useState<Investigation[]>();
  const cols = React.useMemo<ColumnDef<Investigation>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'name',
        header: 'Name',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'created',
        header: 'Created',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'created_by',
        header: 'Created By',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        cell: (info) => info.getValue(),
      },
    ],
    [],
  );

  useEffect(() => {
    if (items) {
      const newData: Investigation[] = [];
      items.forEach((item: Investigation) => {
        newData.push({
          id: item.id,
          name: (
            <NavLink
              id={`investigation-link-${item.id}`}
              to={`/investigations/${item.id}`}
            >
              {item.name}
            </NavLink>
          ),
          created: convertToReadableFormat(item.created)?.toLocaleString(),
          created_by: item.created_by,

          status: item.status,
          actions: (
            <ButtonGroup>
              <Button id={`share-${item.id}`} onClick={() => {}}>
                Share
              </Button>
              <Button
                id={`delete-${item.id}`}
                onClick={() => {
                  const confirm = window.confirm(
                    'Are you sure you would like to delete this investigation?',
                  );
                  if (confirm && item.id) {
                    deleteItem(item.id).then(() => {
                      getItems();
                    });
                  } else {
                    return;
                  }
                }}
              >
                Delete
              </Button>
            </ButtonGroup>
          ),
        });
      });
      setInvestigiations(newData);
    }
  }, [items, deleteItem, getItems]);

  useEffect(() => {
    getItems();
  }, [getItems]);

  useEffect(() => {
    if (investigations) {
      setLoading(false);
    }
  }, [loading, investigations]);

  // Clear current search when navigating to home
  useEffect(() => {
    setCurrentSearch('');
  }, [setCurrentSearch]);
  return (
    <div className="grid-container">
      <div className="grid-row">
        <div className="grid-col">
          <h1>History</h1>
        </div>
      </div>
      <div className="grid-row">
        <div className="grid-col">
          {loading ? (
            <img
              src={infinteLoop}
              alt="loading"
              className="searching history"
            />
          ) : investigations ? (
            <DataTable
              id="investigation-table"
              className="width-full"
              columns={cols}
              data={investigations}
              sortable
              sortCol="id"
              sortDir="desc"
            ></DataTable>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};
