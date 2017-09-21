import React from 'react'

import MonitorGroupsModalView from './MonitorGroupsModalView'
import MonitorGroupModal from './MonitorGroupModal'

export default class MonitorGroupsModal extends React.Component {
  onHide () {
    this.props.showMonitorGroupsModal(false)
  }
  onClickAdd () {
    this.props.showMonitorGroupModal(true)
  }
  onClickEdit () {

  }
  onClickRemove () {

  }

  renderEditModal () {
    if (!this.props.monitorGroupModalOpen) return null
    return (
      <MonitorGroupModal {...this.props}/>
    )
  }

  render () {
    return (
      <MonitorGroupsModalView
        monitorGroups={this.props.monitorGroups}
        onHide={this.onHide.bind(this)}
        onClickAdd={this.onClickAdd.bind(this)}
        onClickEdit={this.onClickEdit.bind(this)}
        onClickRemove={this.onClickRemove.bind(this)}
        editModal={this.renderEditModal()}
      />
    )
  }
}