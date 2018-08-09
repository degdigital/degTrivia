import React from 'react';

const QuestionsTable = function(props) {

    return (
        <table>
            <caption>All Questions For Game</caption>
            <thead>
                <tr>
                    <th>Text</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {
                    props.questions.map(question => {
                        return (
                            <tr key={question.id}>
                                <td>{question.question || ''}</td>
                                <td>
                                    <button className="button" onClick={() => props.editQuestion(question)}>Edit</button>
                                    <button className="button">Delete</button>
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