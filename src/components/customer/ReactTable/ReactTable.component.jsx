/* eslint-disable no-shadow */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useMemo } from 'react'
import { useTable, usePagination, useFilters } from 'react-table'

const ReactTable = ({
  columns,
  data,
  fetchData,
  loading,
  pageCount: controlledPageCount,
  defaultPageSize,
}) => {
  // Define a default UI for filtering
  const DefaultColumnFilter = ({ column: { filterValue, preFilteredRows, setFilter }, }) => {
    return (
      <input
        value={filterValue || ''}
        onChange={e => {
          setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
        }}
        placeholder={`Tìm kiếm...`}
      />
    )
  }

  const filterTypes = useMemo(() => ({
    text: (rows, id, filterValue) => {
      return rows.filter(row => {
        const rowValue = row.values[id]
        return rowValue !== undefined
          ? String(rowValue)
            .toLowerCase()
            .startsWith(String(filterValue).toLowerCase())
          : true
      })
    },
  }), [])

  const defaultColumn = useMemo(() => ({
    // Let's set up our default Filter UI
    Filter: DefaultColumnFilter,
  }), [])

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    // setPageSize,
    state: { pageIndex, pageSize, filters },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
      initialState: { pageIndex: 0, pageSize: defaultPageSize, filters: [] }, // Pass our hoisted table state
      manualPagination: true, // Tell the usePagination
      manualFilters: true,
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
      pageCount: controlledPageCount,
    },
    useFilters,
    usePagination,
  )

  useEffect(() => {
    fetchData({ pageIndex, pageSize, filters })
  }, [fetchData, pageIndex, pageSize, filters])

  return (
    <>
      <div className="dataTables_wrapper">
        <table {...getTableProps()} className="data-table user-tnx">
          <thead>
            {headerGroups.map(headerGroup => (
              <>
                <tr {...headerGroup.getHeaderGroupProps()} className="data-item data-head">
                  {headerGroup.headers.map(column => (
                    <th
                      {...column.getHeaderProps()}
                      style={column.headerStyle || {}}
                      className={column.headerClassName || {}}
                    >
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
                <tr {...headerGroup.getHeaderGroupProps()} className="data-item data-head">
                  {headerGroup.headers.map(column => (
                    <th
                      {...column.getHeaderProps()}
                      style={column.headerStyle || {}}
                      className={column.headerClassName || {}}
                    >
                      <div>{column.canFilter ? column.render('Filter') : null}</div>
                    </th>
                  ))}
                </tr>
              </>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map(row => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()} className="data-item">
                  {row.cells.map(cell => (
                    <td
                      {...cell.getCellProps()}
                      style={cell.column.style || {}}
                      className={cell.column.className || {}}
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              )
            })}
            <tr className="data-item">
              {loading ? (
                // Use our custom loading state to show a loading indicator
                <td
                  colSpan="10000"
                  className="data-col"
                  style={{ borderBottom: 'none', color: '#23406c' }}
                >
                  Đang tải...
                </td>
              ) : (
                  <td
                    colSpan="10000"
                    className="data-col"
                    style={{ borderBottom: 'none', color: '#23406c' }}
                  >
                    Hiển thị {page.length} trên ~{controlledPageCount * pageSize} kết quả
                  </td>
                )}
            </tr>
          </tbody>
        </table>
        {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
        <div className="row align-items-center" style={{ marginRight: '0px', marginLeft: '0px' }}>
          <div className="text-left" style={{ whiteSpace: 'nowrap' }}>
            <div className="pagination dataTables_paginate">
              <ul className="pagination">
                <li className="paginate-button-page-item previous">
                  <a
                    href="#!"
                    className="page-link"
                    onClick={() => gotoPage(0)}
                    disabled={!canPreviousPage}
                  >
                    Trang đầu
                  </a>
                </li>
                <li className="paginate-button-page-item previous">
                  <a
                    href="#!"
                    className="page-link"
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                  >
                    Trang trước
                  </a>
                </li>
                <li className="paginate-button-page-item next">
                  <a
                    href="#!"
                    className="page-link"
                    onClick={() => nextPage()}
                    disabled={!canNextPage}
                  >
                    Trang kế
                  </a>
                </li>
                <li className="paginate-button-page-item next">
                  <a
                    href="#!"
                    className="page-link"
                    onClick={() => gotoPage(pageCount - 1)}
                    disabled={!canNextPage}
                  >
                    Trang cuối
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div
          className="row align-items-center justify-content-end"
          style={{ color: '#23406c', marginRight: '0px', marginLeft: '0px' }}
        >
          <div>
            Trang{' '}
            <strong>
              {pageIndex + 1} / {pageOptions.length}
            </strong>{' '}
          </div>
          <div>
            | Nhập số trang{' '}
            <input
              className="input-bordered"
              type="number"
              defaultValue={pageIndex + 1}
              onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0
                gotoPage(page)
              }}
              style={{ width: '100px' }}
            />
          </div>{' '}
          {/* <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value))
            }}
          >
            {[5, 10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Hiển thị trang {pageSize}
              </option>
            ))}
          </select> */}
        </div>
      </div>
    </>
  )
}

export default ReactTable
