import React from 'react';

const QuestionsTable = function(props) {

    return (
        <table className="table table--wide">
            <caption className="table__caption">All Questions For Game</caption>
            <thead className="table__header-row">
                <tr className="table__row table__row--header">
                    <th className="table__heading table__heading--left table__heading--bold">Order</th>
                    <th className="table__heading table__heading--left table__heading--bold">Text</th>
                    <th></th>
                </tr>
            </thead>
            <tbody className="table__table-body">
                {
                    props.questions.map(question => {
                        return (
                            <tr key={question.id} className="table__row table__data-row">
                                <td className="table__data-cell">{question.order}</td>
                                <td className="table__data-cell">{question.question || ''}</td>
                                <td className="table__data-cell button-group">
                                    <button className="button button--small button--alt" type="button" onClick={() => props.editQuestion(question)}>Edit</button>
                                    <button className="button button--small button--orange" type="button" onClick={() => props.deleteQuestion(question.id)}>Delete</button>
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}

export default QuestionsTable;