import React from 'react'
import Modal from 'react-bootstrap-modal'
import {MenuItem, SelectField, TextField} from 'material-ui'

import { Header, TwoButtonsBlockCustom } from './parts'
import { errorStyle, underlineFocusStyle, inputStyle,
  selectedItemStyle, underlineStyle } from 'style/materialStyles'

export default class WorkflowSelectModalView extends React.Component {
  render () {
    const {
      onChangeCategory,
      onClickClose, onClickOK,
      workflows,
      selectedRowWf, onClickRow,
      selectedCategory, workflowCategories,
      workflowFilter, onChangeWorkflowFilter
    } = this.props
    return (
      <Modal
        show
        onHide={onClickClose}
        aria-labelledby="ModalHeader"
        className="bootstrap-dialog type-primary modal-w-9">
        <Header name="Workflow" />
        <div className="modal-body bootstrap-dialog-message">
          <div className="padding-md-left">
            <SelectField
              errorStyle={errorStyle}
              underlineStyle={underlineFocusStyle}
              selectedMenuItemStyle={selectedItemStyle}
              menuItemStyle={inputStyle}
              labelStyle={inputStyle}
              value={selectedCategory || ''}
              onChange={onChangeCategory}
            >
              <MenuItem key="0" value="" primaryText="[All]" />
              {workflowCategories.map(c =>
                <MenuItem key={c.id} value={c.name} primaryText={c.name} />
              )}
            </SelectField>
            <TextField
              hintText="Search"
              errorStyle={errorStyle}
              inputStyle={inputStyle}
              underlineFocusStyle={underlineStyle}
              style={{marginLeft: '20px', verticalAlign: 'top'}}
              value={workflowFilter}
              onChange={onChangeWorkflowFilter}
            />
          </div>
          <div style={{maxHeight: '400px', overflow: 'auto'}}>
            <table className="table table-hover">
              <thead>
              <tr>
                <th>Category</th>
                <th>Severity</th>
                <th>Name</th>
                <th>Description</th>
                <th>Version</th>
              </tr>
              </thead>
              <tbody>
              {
                workflows.map(w =>
                  <tr
                    key={w.id}
                    className={selectedRowWf === w.id ? 'selected' : ''}
                    onClick={() => onClickRow(w.id)}
                  >
                    <td>{w.category}</td>
                    <td>{w.severity}</td>
                    <td>{w.name}</td>
                    <td>{w.desc}</td>
                    <td>{w.version}</td>
                  </tr>
                )
              }
              </tbody>
            </table>
          </div>
          <TwoButtonsBlockCustom name1="Cancel" action1={onClickClose} name2="OK" action2={onClickOK}/>
        </div>
      </Modal>
    )
  }
}
