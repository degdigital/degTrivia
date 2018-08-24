import React from 'react';

const Table = function(props) {
    function renderHeadings() {
        return (
            <thead className="table__header-row">
                <tr className="table__row table__row--header">
                    {props.columns.map((col, index) => (
                        <th className="table__heading table__heading--left table__heading--bold" key={index}>{col.displayName}</th>
                    ))}
                </tr>
            </thead>
        );
    }

    function renderBody() {
        return (
            <tbody  className="table__table-body">
                {props.data.map(dataItem => {
                    return (
                        <tr key={dataItem.id} className="table__row table__data-row">
                            {props.columns.map((col, index) => (
                                <td className="table__data-cell" key={index}>{renderCell(dataItem, col)}</td>
                            ))}
                        </tr>
                    )
                })}
            </tbody>
        )
    }

    function renderCell(dataItem, columnInfo) {
        switch(columnInfo.type) {
            case 'date':
            case 'custom':
                return columnInfo.renderFn(dataItem);
            default: 
                return dataItem[columnInfo.propName]
        }
    }

    return (
        <table className="table table--wide">
            <caption className="table__caption">{props.caption}</caption>
            {renderHeadings()}
            {renderBody()}
        </table>
    )
}

export default Table;