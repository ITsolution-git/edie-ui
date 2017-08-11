import React from 'react'
import {Dialog, IconButton, FlatButton} from 'material-ui'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'

export default class BoardListModalView extends React.Component {
  render () {
    const {onHide, gaugeBoards, onClickEdit, onClickDelete} = this.props
    return (
      <Dialog open title="Dashboards" onRequestClose={onHide} contentStyle={{width: 400}}>
        <div style={{maxHeight: 300, overflow: 'auto'}}>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            {gaugeBoards.map(p =>
              <tr key={p.id}>
                <td>{p.name}</td>
                <td className="text-right">
                  <IconButton style={{padding: 0, width: 24, height: 24}} onTouchTap={() => onClickEdit(p)}>
                    <EditIcon color="#545454" hoverColor="#f44336"/>
                  </IconButton>
                  <IconButton style={{padding: 0, width: 24, height: 24}} onTouchTap={() => onClickDelete(p)}>
                    <DeleteIcon color="#545454" hoverColor="#f44336"/>
                  </IconButton>
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
        <div className="form-buttons close-block">
          <FlatButton label="OK" onClick={onHide} primary/>
        </div>
      </Dialog>
    )
  }
}
