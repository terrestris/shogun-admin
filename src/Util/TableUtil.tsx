import React, { useEffect, useState } from 'react';

import {
  SearchOutlined
} from '@ant-design/icons';
import { Button, Input, InputRef } from 'antd';
import { FilterDropdownProps } from 'antd/es/table/interface';
import { FilterConfirmProps } from 'antd/lib/table/interface';
import _get from 'lodash/get';
import _isFunction from 'lodash/isFunction';
import _isNil from 'lodash/isNil';

import i18n from '../i18n';

type MyFilterDropdownProps = {
  selectedKeys: any;
  setSelectedKeys: any;
  dataIndex: any;
  confirm: any;
  clearFilters: any;
  entityType: string;
  entities: any;
};

const FilterDropdown = ({
  selectedKeys,
  setSelectedKeys,
  dataIndex,
  confirm,
  clearFilters,
  entityType,
  entities
}: MyFilterDropdownProps) => {
  let searchInput: InputRef | null;

  const [filterValue, setFilterValue] = useState<string>();

  const resetAndSet = () => {
    handleReset(clearFilters);
    handleSearch(selectedKeys, confirm);
  };

  useEffect(() => {
    if (selectedKeys.length === 0){
      return;
    }
    resetAndSet();
    /*
     with further dependecies searching was not possilbe.
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityType, entities.length]);

  const handleSearch = (
    _selectedKeys: React.Key[],
    _confirm?: (param?: FilterConfirmProps | undefined) => void
  ) => {
    if (_isFunction(confirm)) {
      confirm();
    }
  };

  const handleReset = (_clearFilters?: () => void) => {
    if (_isFunction(clearFilters)) {
      setFilterValue('');
      clearFilters();
    }
  };

  const onChange = (e: any) => {
    setFilterValue(e.target.value);
    setSelectedKeys(e.target.value ? [e.target.value] : []);
  };

  return (
    <div
      style={{
        padding: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch'
      }}
    >
      <Input
        ref={node => { searchInput = node; }}
        placeholder={`${i18n.t('GeneralEntityTable.popupSearch')} ${dataIndex}`}
        value={filterValue}
        onChange={onChange}
        onPressEnter={() => handleSearch(selectedKeys, confirm)}
        style={{
          flex: 1,
          marginBottom: 8,
        }}
      />
      <div style={{ display: 'flex' }}>
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm)}
          icon={<SearchOutlined />}
          size="small"
          style={{
            flex: 1,
            marginRight: 8
          }}
        >
          {`${i18n.t('GeneralEntityTable.popupFilter')}`}
        </Button>
        <Button
          onClick={() => {resetAndSet();}}
          size="small"
          style={{ flex: 1 }}>
          {`${i18n.t('GeneralEntityTable.popupReset')}`}
        </Button>
      </div>
    </div>
  );
};

export default class TableUtil {

  public static getColumnSearchProps<T>(
    dataIndex: string | string[],
    entityType: string,
    entities: any
  ) {
    let searchInput: InputRef | null;

    return {
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: FilterDropdownProps) => (
        <FilterDropdown
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
          confirm={confirm}
          clearFilters={clearFilters}
          dataIndex={dataIndex}
          entityType={entityType}
          entities={entities}
        />
      ),
      filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (value: string | number | boolean, record: T) => {
        let recVal: any;
        if (Array.isArray(dataIndex)) {
          let a: any;
          dataIndex.forEach((key, i) => i === 0 ? a = _get(record, key) : a = _get(a, key));
          recVal = a;
        } else {
          recVal = _get(record, dataIndex);
        }
        return `${recVal}`
          .toLowerCase()
          .includes(`${value}`.toLowerCase());
      },
      onFilterDropdownVisibleChange: (visible: boolean) => {
        if (visible) {
          setTimeout(() => searchInput?.select());
        }
      }
    };
  };

  public static getSorter<T>(dataIndex: string){
    return (a: T, b: T) => {
      const valA: string = _get(a, dataIndex)?.toString();
      const valB: string = _get(b, dataIndex)?.toString();
      return valA?.localeCompare(valB, undefined, {
        numeric: true,
        sensitivity: 'base'
      });
    };
  };
}
