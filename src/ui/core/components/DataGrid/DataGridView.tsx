import {
  Box,
  Checkbox,
  CheckboxProps,
  CssBaseline,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material'
import {
  Cell,
  HeaderGroup,
  Row,
  TableInstance,
  TableOptions,
  useBlockLayout,
  useExpanded,
  useFilters,
  useFlexLayout,
  useGlobalFilter,
  useGroupBy,
  usePagination,
  useResizeColumns,
  useRowSelect,
  useSortBy,
  useTable,
  SortingRule
} from 'react-table'
import React, { forwardRef, useEffect, useState, useRef, MutableRefObject } from 'react'

import SearchInput from 'src/ui/core/components/SearchInput/SearchInput'
import Typography from 'src/theme/overrides/Typography'
import { matchSorter } from 'match-sorter'
import { observer } from 'mobx-react'
import palette from 'src/theme/palette'
// @ts-ignore
import uniqid from 'uniqid'
import { useDataGridContext } from 'src/contexts/DataGridContext'

// @ts-ignore
const headerProps = (props, { column }) => getStyles(props, 'left')

// @ts-ignore
const cellProps = (props, { cell }) => getStyles(props, 'left')

// @ts-ignore
const getStyles = (props, align = 'left') => [
  props,
  {
    style: {
      justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
      alignItems: 'flex-start',
      display: 'flex',
    },
  },
]
function fuzzyTextFilterFn(rows: any, id: string | number, filterValue: any) {
  return matchSorter(rows, filterValue, {
    keys: [(row: any) => row.values[id]],
  })
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val: any) => !val
function DataGridView(props: any) {
  const {
    state,
    columns,
    data = [],
    renderRowSubComponent = ({ row }: any) => (
      <div>renderRowSubComponent is needed</div>
    ),
    height,
  } = props
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows: any[], id: string | number, filterValue: any) => {
        return rows.filter((row: any) => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    []
  )
  const defaultColumn = React.useMemo(
    () => ({
      // When using the useFlexLayout:
      minWidth: 200, // minWidth is only used as a limit for resizing
      width: 200, // width is used for both the flex-basis and flex-grow
      maxWidth: 400, // maxWidth is only used as a limit for resizing
      Filter: DefaultColumnFilter,
    }),
    []
  )
  const options: TableOptions<object> & any = {
    columns: columns,
    data: data,
    defaultColumn,
    filterTypes,
  }
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    selectedFlatRows,
    preGlobalFilteredRows,
    setGlobalFilter,
    visibleColumns,
    rows,
    state: { expanded, pageIndex, pageSize, selectedRowIds, globalFilter, sortBy },
  }: TableInstance<any> = useTable(
    options,
    useFilters,
    useGlobalFilter,
    useGroupBy,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect,
    useResizeColumns,
    // useFlexLayout,
    // useBlockLayout,
    (hooks) => {
      hooks.allColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: 'selection',
          disableResizing: true,
          minWidth: 35,
          width: 50,
          maxWidth: 50,
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ])
      // hooks.visibleColumns.push((columns) => [
      //   {
      //     id: 'selection',
      //     Header: ({ getToggleAllPageRowsSelectedProps }) => {
      //       return (
      //         <div>
      //           <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
      //         </div>
      //       )
      //     },
      //     Cell: ({ row }) => {
      //       return <div><IndeterminateCheckbox {...row.getToggleRowSelectedProps()} /></div>
      //     },
      //   },
      //   ...columns,
      // ])
      // hooks.useInstanceBeforeDimensions.push(({ headerGroups }) => {
      //   // fix the parent group of the selection button to not be resizable
      //   const selectionGroupHeader = headerGroups[0].headers[0]
      //   selectionGroupHeader.canResize = false
      // })
    }
  )

    // Define the ref with the correct type
    const prevSortByRef = useRef<SortingRule<any>[]>([]);

  //   interface SelectedRowsArray {
  //     [index: number]: any;     
  // }

  // const prevSelectedRowsRef = useRef<SelectedRowsArray>([]);
  const prevSelectedRowsRef = useRef<any[]>([]);
    // const { selectedRows, setSelectedRows } = useDataGridStore();
    // const { selectedRows, setSelectedRows } = useDataGridContext();

  useEffect(() => {

    // if(props.onSortChange) {
    //   props.onSortChange(sortBy)    
    // }

    // console.log("DataGridView useEffect: ", sortBy, prevSortByRef.current)
    // Only call onSortChange if sortBy has actually changed
    // if (JSON.stringify(sortBy) !== JSON.stringify(prevSortByRef.current)) {
    //   if (props.onSortChange) {
    //     props.onSortChange(sortBy);
    //   }
    //   prevSortByRef.current = sortBy;
    // }    

    // console.log(selectedFlatRows);
    // console.log(props.onDataGridChange);

    if(selectedFlatRows.length > 0) {
    // handleCheckboxEvent();
        if (props.onDataGridChange) {
          const selectedRows = selectedFlatRows.map(d => d.original);
          
          const selectedRowIds = selectedFlatRows
          .map((selectedFlatRow) => selectedFlatRow.original)
          .map((original) => {
            return original._id
          })           

          // state.selectedRowIds = selectedRowIds;

          // console.log("prevSelectedRowsRef.current 0:", selectedFlatRows, prevSelectedRowsRef.current, selectedRowIds)
          
          // if(selectedRowIds.length > 0 && prevSelectedRowsRef.current !== selectedRowIds) {
            if (!arraysEqual(selectedRowIds, prevSelectedRowsRef.current)) {
            // prevSelectedRowsRef.current = selectedRowIds;
          // if(prevSelectedRowsRef.current.length > 0 && prevSelectedRowsRef.current !== selectedRowIds) {
            // console.log("prevSelectedRowsRef.current 1:", prevSelectedRowsRef.current, selectedRowIds)

            // console.log("DataGridView selectedRowIds: ", selectedRowIds)
            // console.log("DataGridView selectedRows: ", selectedRows)
            
            // if (props.onDataGridChange) {
            const selectedRowsObj = {
              // selectedRowIds,
              // selectedFlatRows,
              selectedRows,
              contextKey: 'selectedRows'
            }

            // console.log("DataGridView selectedRowIds: ", selectedRowsObj)

            props.onDataGridChange(selectedRowsObj);
          // }
            
            state.selectedRowIds = selectedRowIds;

            prevSelectedRowsRef.current = selectedRowIds;
            return;
          }
        } else { //-- in case the onDataGridChange prop has not been set for the component
          state.selectedRowIds = selectedFlatRows
            .map((selectedFlatRow) => selectedFlatRow.original)
            .map((original) => {
              return original._id
            })          
        }
    }

    if(sortBy[0]) {
      if (prevSortByRef.current !== sortBy) {
        
        if (props.onDataGridChange) {
          const sortByObj = {
            ...sortBy,
            contextKey: 'sortBy'
          }
          props.onDataGridChange(sortByObj);
        }
        prevSortByRef.current = sortBy;
      }
    }

    // state.selectedRowIds = selectedFlatRows
    //   .map((selectedFlatRow) => selectedFlatRow.original)
    //   .map((original) => {
    //     return original._id
    //   })

  }, [selectedFlatRows, sortBy, props.onDataGridChange])

  // const handleCheckboxEvent = () => {
    
  //   // Process selected rows
  //   const selectedRowsData = selectedFlatRows.map(d => d.original); // Gets the original data of each selected row
  //   console.log("DataGridView: ", selectedRowsData);

  //   setSelectedRows(selectedRowsData);
    
  // };

// Utility function to compare array contents
function arraysEqual(arr1: any, arr2: any) {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

  const tableCellStyle: any = {
    style: {
      lineHeight: 3.5,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      // overflow: 'hidden',
      // textOverflow: 'clip'
    },
  }
  // if (props.isSubTable) {
  //   return (
  //     <div>
  //       {/* <Box sx={{ width: 500, mb: 2 }}></Box> */}
  //       {/* <CssBaseline /> */}
  //       <TableContainer sx={{ boxShadow: 2 }}>
  //         <Table {...getTableProps()} size="small">
  //           <TableHead>
  //             {headerGroups.map((headerGroup: HeaderGroup) => (
  //               <TableRow {...headerGroup.getHeaderGroupProps()}>
  //                 {headerGroup.headers.map((column) => {
  //                   return (
  //                     <TableCell
  //                       sx={{
  //                         padding: 0,
  //                       }}
  //                       {...(column.id === 'selection'
  //                         ? column.getHeaderProps(tableCellStyle)
  //                         : column.getHeaderProps(
  //                             column.getSortByToggleProps(tableCellStyle)
  //                           ))}
  //                     >
  //                       <span className="title">{column.render('Header')}</span>
  //                       {column.id !== 'selection' ? (
  //                         <TableSortLabel
  //                           active={column.isSorted}
  //                           direction={column.isSortedDesc ? 'desc' : 'asc'}
  //                         />
  //                       ) : null}
  //                       {column.canResize && (
  //                         <div
  //                           {...column.getResizerProps({
  //                             style: {
  //                               top: 0,
  //                               right: 0,
  //                               zIndex: 1,
  //                               width: 10,
  //                               height: '100%',
  //                               position: 'absolute',
  //                               touch: 'none',
  //                             },
  //                           })}
  //                           className={`resizer ${
  //                             column.isResizing ? 'isResizing' : ''
  //                           }`}
  //                         />
  //                       )}
  //                       <div>
  //                         {column.canFilter ? column.render('Filter') : null}
  //                       </div>
  //                     </TableCell>
  //                   )
  //                 })}
  //               </TableRow>
  //             ))}
  //           </TableHead>
  //           <TableBody {...getTableBodyProps()}>
  //             {rows.map((row: Row) => {
  //               prepareRow(row)
  //               return (
  //                 <React.Fragment key={uniqid()}>
  //                   <TableRow {...row.getRowProps()} hover>
  //                     {row.cells.map((cell: Cell) => {
  //                       return (
  //                         <TableCell
  //                           sx={{
  //                             fontSize: '0.75rem',
  //                             padding: '0.5rem 0',
  //                           }}
  //                           {...cell.getCellProps(tableCellStyle)}
  //                           // className="td"
  //                         >
  //                           {cell.render('Cell')}
  //                         </TableCell>
  //                       )
  //                     })}
  //                   </TableRow>
  //                   {row.isExpanded && renderRowSubComponent ? (
  //                     <TableRow sx={{ overflow: 'scroll' }}>
  //                       <TableCell colSpan={visibleColumns.length}>
  //                         {renderRowSubComponent({ row })}
  //                       </TableCell>
  //                     </TableRow>
  //                   ) : null}
  //                 </React.Fragment>
  //               )
  //             })}
  //           </TableBody>
  //         </Table>
  //       </TableContainer>
  //     </div>
  //   )
  return (
    <div>
      <Box
        sx={{
          width: 250,
          height: 28,
          mb: 2,
          display: props.isSubTable ? 'none' : 'block',
        }}
      >
        {/* <SearchInput
          preGlobalFilteredRows={preGlobalFilteredRows}
          setGlobalFilter={setGlobalFilter}
          globalFilter={globalFilter}
        /> */}
      </Box>
      {/* <CssBaseline /> */}
      <TableContainer
        sx={{
          boxShadow: 2,
          border: props.isSubTable ? '1px solid black' : '',
          borderColor: props.isSubTable ? palette.light.button.blue : '',
          mb: props.isSubTable ? 2.5 : 0,
          height: height ? height : undefined,
        }}
      >
        <Table {...getTableProps()} size="small" className="paginationTable">
          <TableHead>
            {headerGroups.map((headerGroup: HeaderGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  return (
                    <TableCell
                      sx={{
                        fontSize: '0.75rem',
                      }}
                      {...(column.id === 'selection'
                        ? column.getHeaderProps(tableCellStyle)
                        : column.getHeaderProps(
                            column.getSortByToggleProps(tableCellStyle)
                          ))}
                    >
                      <div
                        className={`title ${
                          (column as any)?.headerClassName
                            ? (column as any).headerClassName
                            : ''
                        }`}
                      >
                        <span>{column.render('Header')}</span>
                        {column.id !== 'selection' ? (
                          <TableSortLabel
                            active={column.isSorted}
                            direction={column.isSortedDesc ? 'desc' : 'asc'}
                          />
                        ) : null}
                      </div>
                      {column.canResize && (
                        <div
                          {...column.getResizerProps({
                            style: {
                              top: 0,
                              right: 0,
                              zIndex: 1,
                              width: 10,
                              height: '100%',
                              position: 'absolute',
                              touch: 'none',
                            },
                          })}
                          className={`resizer ${
                            column.isResizing ? 'isResizing' : ''
                          }`}
                        />
                      )}
                      <div>
                        {column.canFilter ? column.render('Filter') : null}
                      </div>
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {rows.map((row: Row) => {
              prepareRow(row)
              return (
                <React.Fragment key={uniqid()}>
                  <TableRow {...row.getRowProps()} hover>
                    {row.cells.map((cell: Cell) => {
                      return (
                        <TableCell
                          sx={{
                            fontSize: '0.75rem',
                          }}
                          {...cell.getCellProps({
                            ...tableCellStyle,
                          })}
                          style={{
                            ...cell.getCellProps({
                              ...tableCellStyle,
                              width: cell.column?.width,
                            }).style,
                            width: cell.column?.width,
                          }}
                          // className="td"
                        >
                          {cell.render('Cell')}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                  {row.isExpanded && renderRowSubComponent ? (
                    <TableRow
                      sx={{
                        overflow: 'scroll',
                      }}
                    >
                      <TableCell
                        colSpan={visibleColumns.length}
                        sx={{
                          bgcolor: '#f2f2f2',
                          pl: '0 !important',
                        }}
                      >
                        {renderRowSubComponent({ row })}
                      </TableCell>
                    </TableRow>
                  ) : null}
                </React.Fragment>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
export default observer(DataGridView)

// export const IndeterminateCheckbox = React.forwardRef(
//   ({ indeterminate, style, ...rest }: any, ref) => {
//     const defaultRef = React.useRef<HTMLInputElement>(null)
//     const resolvedRef: any = ref || defaultRef

//     React.useEffect(() => {
//       resolvedRef.current.indeterminate = indeterminate
//     }, [resolvedRef, indeterminate])

//     return <Checkbox ref={resolvedRef} {...rest} />
//   }
// )
interface IndeterminateCheckboxProps extends CheckboxProps {
  indeterminate?: boolean;
}

// export const IndeterminateCheckbox = forwardRef<HTMLInputElement, IndeterminateCheckboxProps>(
// ({ indeterminate, ...rest }, ref) => {
//   const defaultRef = useRef<HTMLInputElement>(null);
//   const resolvedRef = ref || defaultRef;

//   useEffect(() => {
//     if (resolvedRef.current) {
//       resolvedRef.current.indeterminate = indeterminate ?? false;
//     }
//   }, [resolvedRef, indeterminate]);

//   return <Checkbox ref={resolvedRef} {...rest} />;
// }
// );

// export const IndeterminateCheckbox = forwardRef<HTMLInputElement, IndeterminateCheckboxProps>(
//   ({ indeterminate, ...rest }, ref) => {
//     // Fallback ref if none is provided
//     const fallbackRef = useRef<HTMLInputElement>(null);
//     const resolvedRef = ref as MutableRefObject<HTMLInputElement> || fallbackRef;

//     useEffect(() => {
//       if (resolvedRef.current) {
//         resolvedRef.current.indeterminate = indeterminate ?? false;
//       }
//     }, [resolvedRef, indeterminate]);

//     return <Checkbox ref={resolvedRef} {...rest} />;
//   }
// );

export const IndeterminateCheckbox = forwardRef<HTMLButtonElement, IndeterminateCheckboxProps>(
  ({ indeterminate, ...rest }, ref) => {
    
    useEffect(() => {
      // Direct DOM manipulation to set the indeterminate property
      const currentRef = (ref && typeof ref !== 'function') ? 'current' in ref ? ref.current : null : null;
      if (currentRef) {
        const inputElement = currentRef.querySelector('input');
        if (inputElement) {
          inputElement.indeterminate = indeterminate ?? false;
        }
      }
    }, [ref, indeterminate]);

    return <Checkbox ref={ref} {...rest} />;
  }
);

function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}: any) {
  const count = preFilteredRows.length
  const [open, setOpen] = useState(false)
  const onClickMore = (e: any) => {
    e.stopPropagation()
    setOpen((state) => !state)
  }
  return null
  // <Box sx={{
  //   position: 'absolute',
  //   top: 5,
  //   right: 2
  // }}>
  //   <IconButton
  //     onClick={onClickMore}
  //   >
  //     <MoreVert />
  //   </IconButton>
  //   {open &&
  //     <Box
  //       sx={{
  //         position: 'absolute',
  //         bottom: -25,
  //         right: 25,
  //         width: 150,
  //       }}>
  //       <TextField
  //         sx={{
  //           bgcolor: 'white'
  //         }}
  //         size='small'
  //         value={filterValue || ''}
  //         onChange={e => {
  //           setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
  //         }}
  //         placeholder={`search`}
  //       />
  //     </Box>
  //   }
  // </Box>
}
