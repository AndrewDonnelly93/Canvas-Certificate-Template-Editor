import React from 'react';
// Components
import TablePagination from "@src/components/shared/TablePagination/TablePagination";
// Store
import {observer} from "mobx-react-lite";

const TablePaginationObservable = ({
                                     currentPage,
                                     handlePaginationChange,
                                     handlePageSizeChange,
                                     pageSize,
                                     total
                                   }) => {
  return (
    <TablePagination
      currentPage={currentPage}
      handlePaginationChange={handlePaginationChange}
      handlePageSizeChange={handlePageSizeChange}
      pageSize={pageSize}
      total={total}
    />
  );
}

export default observer(TablePaginationObservable);


