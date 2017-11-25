import React from 'react'
import {Checkbox, SelectField, MenuItem} from 'material-ui'
import {findIndex} from 'lodash'

import TabPage from 'components/common/TabPage'
import TabPageBody from 'components/common/TabPageBody'
import MainWorkflowModal from 'components/dashboard/map/device/main/workflows/MainWorkflowModal'
import AddWfTabs from './AddWfTabs'

import {severities} from 'shared/Global'

export default class AddWf extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      tab:0,
      severity: ''
    }
  }
  componentWillMount () {
    // this.props.fetchDevice(this.getDeviceId())
    this.props.fetchWorkflows()
  }

  getDeviceId () {
    return this.props.match.params.z
  }
  getDevice () {
    return null
  }

  onClickDiagram () {
    this.props.history.push(`/${this.props.match.params.device}/editwf/diagram/${this.getWorkflowId()}`)
  }

  onFinish () {
    this.props.history.push('/devicewf')
  }

  onClickTab (tab) {
    this.setState({
      tab
    })
  }

  ////////////////////////////////////////////////

  onChangeCheck (workflow, e, checked) {
    if (checked) {
      this.props.selectSysWorkflow(workflow)
    } else {
      this.props.deselectSysWorkflow(workflow)
    }
  }

  onChangeSeverity (e, index, value) {
    this.setState({
      severity: value
    })
  }

  ////////////////////////////////////////////////
  renderTab1 () {
    const {sysWorkflows, selectedSysWorkflows} = this.props
    return (
      <div className="flex-vertical flex-1">
        <div className="padding-xs">
          <SelectField value={this.state.severity} onChange={this.onChangeSeverity.bind(this)}>
            <MenuItem value="" primaryText="[All]"/>
            {severities.map(option =>
              <MenuItem
                key={option.value}
                value={option.value}
                primaryText={option.label}
              />
            )}
          </SelectField>
        </div>
        <div className="flex-1" style={{overflow: 'auto'}}>
          <table className="table table-hover">
            <thead>
            <tr>
              <th>Severity</th>
              <th>Name</th>
              <th>Description</th>
              <th>Version</th>
            </tr>
            </thead>
            <tbody>
            {
              sysWorkflows.map(w =>
                <tr key={w.id}>
                  <td>
                    <Checkbox
                      label={w.severity}
                      checked={findIndex(selectedSysWorkflows, {id: w.id}) >= 0}
                      onCheck={(e, c) => this.onChangeCheck(w, e, c)}
                    />
                  </td>
                  <td>{w.name}</td>
                  <td>{w.desc}</td>
                  <td>{w.version}</td>
                </tr>
              )
            }
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  renderTab2 () {
    return (
      <MainWorkflowModal
        noModal
        onClickDiagram={this.onClickDiagram.bind(this)}
        onFinish={this.onFinish.bind(this)}
      />
    )
  }

  renderContent () {
    if (this.state.tab === 0) {
      return this.renderTab1()
    } else {
      return this.renderTab2()
    }
  }

  render () {
    return (
      <TabPage>
        <div style={{margin: '16px 20px 0'}}>
          <span className="tab-title">Add Workflow</span>
        </div>

        <TabPageBody tabs={AddWfTabs} tab={this.state.tab} onClickTab={this.onClickTab.bind(this)}>
          {this.renderContent()}
        </TabPageBody>
      </TabPage>
    )
  }
}