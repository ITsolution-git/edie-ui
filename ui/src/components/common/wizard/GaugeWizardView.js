import React from 'react'
import moment from 'moment'
import {SelectField, MenuItem, RaisedButton, Checkbox} from 'material-ui'
import { Field } from 'redux-form'
import { SubmitBlock, FormInput, FormSelect, Modal, CardPanel } from 'components/modal/parts'
import {findIndex} from 'lodash'

import {gaugeDurationTypes, gaugeResources, severities, timingOptions, realtimeGauges, historicGauges, gaugeTableViewModes} from 'shared/Global'
import DateRangePicker from 'components/common/DateRangePicker'

import GaugeServerPicker from './input/GaugeServerPicker'
import GaugeLogMonitorPicker from './input/GaugeLogMonitorPicker'
import GaugeWorkflowPicker from './input/GaugeWorkflowPicker'
import LogicalGroupPicker from './input/LogicalGroupPicker'
import DeviceMonitorPicker from './input/DeviceMonitorPicker'
import {required} from 'components/modal/validation/CommonValidation'

const durations = '1 2 3 5 10 15 30'.split(' ').map(p => ({
  label: p, value: p
}))

const fixOptions = [{
  label: 'Any', value: '',
}, {
  label: 'Unfixed', value: 'false'
}, {
  label: 'Fixed', value: 'true'
}]

export default class GaugeWizardView extends React.Component {
  renderDeviceList (showMonitorGroups) {
    const {devices, monitorGroups} = this.props
    let deviceOptions = devices.map(p => ({label: p.name, value: p.id}))
    const monitorGroupOptions = monitorGroups.map(p => ({label: p.name, value: p.id}))

    deviceOptions = showMonitorGroups ? [...deviceOptions, ...monitorGroupOptions] : deviceOptions
    return (
      <Field key="deviceId" name="deviceId" component={FormSelect} floatingLabel="Device" options={deviceOptions} className="valign-top mr-dialog"/>
    )
  }
  renderMonitorPick () {
    const {devices, monitors, formValues} = this.props
    if (formValues.resource !== 'monitor') return null
    if (!devices) {
      return (
        <Field
          name="monitorId" component={FormSelect} floatingLabel="Monitor" options={monitors} className="valign-top mr-dialog"
          validate={[required]}/>
      )
    }
    const index = findIndex(devices, {id: formValues.deviceId})
    const monitorOptions = index < 0 ? [] : devices[index].monitors.map(p => ({label: p.name, value: p.uid}))
    return [
      this.renderDeviceList(),
      <Field
        key="monitorId" name="monitorId" component={FormSelect} floatingLabel="Monitor" options={monitorOptions} className="valign-top"
        validate={[required]}/>
    ]
  }
  renderWorkflowPick () {
    const {formValues} = this.props
    if (formValues.resource !== 'incident') return null
    return (
      <GaugeWorkflowPicker {...this.props} className="margin-md-top"/>
    )
  }
  renderLogicalGroup () {
    const {devices, formValues, selectedMonitors, toggleMonitorId} = this.props
    if (formValues.resource !== 'logicalgroup') return null
    return (
      <div style={{maxHeight: 300, overflow: 'auto'}} className="margin-md-top">
        <table className="table table-hover">
          <tbody>
          {(devices || []).map(d => (d.monitors || []).map(p =>
            <tr key={p.uid}>
              <td><Checkbox label={`${d.name} - ${p.name}`} checked={selectedMonitors.includes(p.uid)} onCheck={() => toggleMonitorId(p.uid)}/></td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    )
  }
  renderTableViewMode () {
    const {templateName} = this.props
    if (templateName !== 'Table') return null
    return (
      <Field name="tableViewMode" component={FormSelect} floatingLabel="View Mode" options={gaugeTableViewModes} className="valign-top" validate={[required]}/>
    )
  }

  renderSearchShortcuts () {

  }
  renderNormal () {
    const {searchList, formValues, durationVisible, splitVisible, templateName} = this.props
    let resourceOptions = gaugeResources
    if (templateName === 'Up/Down') {
      resourceOptions = [...resourceOptions, {
        label: 'Logical Group', value: 'logicalgroup'
      }]
    }
    return (
      <div>
        <Field name="name" component={FormInput} floatingLabel="Name" className="valign-top mr-dialog" validate={[required]}/>
        <Field name="resource" component={FormSelect} floatingLabel="Resource" options={resourceOptions} className="valign-top"/>

        {formValues.resource === 'search' &&
          <Field
            name="savedSearchId" component={FormSelect} floatingLabel="Saved Search" options={searchList} className="valign-top mr-dialog"
            validate={[required]}/>
        }
        {this.renderWorkflowPick()}
        {this.renderMonitorPick()}
        {this.renderLogicalGroup()}

        {this.renderTableViewMode()}

        {durationVisible ? (
          <div className="inline-block">
            <Field name="duration" component={FormSelect} floatingLabel="Duration" options={durations} className="valign-top mr-dialog" style={{width: 100}}/>
            <Field name="durationUnit" component={FormSelect} floatingLabel="  "options={gaugeDurationTypes} className="valign-top" style={{width: 120}}/>
          </div>
          ) : null
        }

        {splitVisible && (formValues.resource === 'search' || formValues.resource === 'incident') ? (
          <div className="inline-block">
            <Field name="splitBy" component={FormSelect} floatingLabel="Resolution" options={durations} className="valign-top mr-dialog" style={{width: 100}}/>
            <Field name="splitUnit" component={FormSelect} floatingLabel="  "options={gaugeDurationTypes} className="valign-top" style={{width: 120}}/>
          </div>
          ) : null
        }
      </div>
    )
  }
  renderDateLabel (label) {
    return (
      <RaisedButton label={label}/>
    )
  }
  renderIncidentTable2 () {
    const {selectedSeverity, onChangeSeverity, dateFrom, dateTo, onChangeDateRange, devices} = this.props
    let deviceOptions = (devices || []).map(p => ({label: p.name, value: p.id}))
    deviceOptions = [
      ...deviceOptions,
      {label: '[Any Device]', value: '*'}
    ]
    return (
      <div>
        <Field name="name" component={FormInput} floatingLabel="Name" className="valign-top mr-dialog" validate={[required]}/>
        {devices && <Field name="deviceId" component={FormSelect} floatingLabel="Device" options={deviceOptions} className="valign-top" validate={[required]}/>}
        <SelectField multiple floatingLabelText="Severity" onChange={onChangeSeverity} className={`valign-top ${devices ? 'mr-dialog' : ''}`} value={selectedSeverity}>
          {severities.map(option =>
            <MenuItem key={option.value} insetChildren checked={selectedSeverity && selectedSeverity.includes(option.value)}
              value={option.value} primaryText={option.label}/>
          )}
        </SelectField>

        <Field name="fixed" component={FormSelect} floatingLabel="Status" options={fixOptions} className="valign-top"/>

        <div className="inline-block" style={{marginTop: 24}}>
          <DateRangePicker
            startDate={moment(dateFrom)}
            endDate={moment(dateTo)}
            onApply={onChangeDateRange.bind(this)}
            renderer={this.renderDateLabel.bind(this)}
          />
        </div>
      </div>
    )
  }

  renderIncidentTable () {
    return (
      <div>
        <Field name="name" component={FormInput} floatingLabel="Name" className="valign-top mr-dialog" validate={[required]}/>
        <DeviceMonitorPicker
          {...this.props}
        />
      </div>
    )
  }

  renderTable () {
    const {workflowOptions} = this.props

    return (
      <div>
        <Field name="name" component={FormInput} floatingLabel="Name" className="valign-top mr-dialog" validate={[required]}/>
        <Field name="workflowId" component={FormSelect} floatingLabel="Workflow" options={workflowOptions} className="valign-top mr-dialog" validate={[required]}/>
      </div>
    )
  }

  renderDeviceBasic () {
    const {devices} = this.props
    const deviceOptions = (devices || []).map(p => ({label: p.name, value: p.id}))
    return (
      <div>
        <Field name="name" component={FormInput} floatingLabel="Name" className="valign-top mr-dialog" validate={[required]}/>
        <Field key="deviceId" name="deviceId" component={FormSelect} floatingLabel="Device" options={deviceOptions} className="valign-top" validate={[required]}/>
        <Field name="checkInterval" component={FormInput} floatingLabel="Interval" className="valign-top mr-dialog"/>
      </div>
    )
  }

  renderDevice () {
    const {devices, formValues} = this.props
    const deviceOptions = (devices || []).map(p => ({label: p.name, value: p.id}))
    return (
      <div>
        <Field name="name" component={FormInput} floatingLabel="Name" className="valign-top mr-dialog" validate={[required]}/>
        {devices && <Field key="deviceId" name="deviceId" component={FormSelect} floatingLabel="Device" options={deviceOptions} className="valign-top" validate={[required]}/>}

        <Field name="timing" component={FormSelect} floatingLabel="Timing" options={timingOptions} className="valign-top mr-dialog" validate={[required]}/>
        <Field
          name="gaugeType" component={FormSelect} floatingLabel="Gauge Type"
          options={formValues.timing === 'realtime' ? realtimeGauges : historicGauges}
          className="valign-top" validate={[required]}
          />

        {formValues.timing === 'historic' ? (
          <div className="inline-block">
            <Field name="duration" component={FormSelect} floatingLabel="Duration" options={durations} className="valign-top mr-dialog" style={{width: 100}}/>
            <Field name="durationUnit" component={FormSelect} floatingLabel="  "options={gaugeDurationTypes} className="valign-top" style={{width: 120}}/>
          </div>
        ) : (
          <Field name="checkInterval" component={FormInput} floatingLabel="Interval" className="valign-top mr-dialog"/>
        )}
      </div>
    )
  }
  renderService () {
    const {services} = this.props
    return (
      <div>
        <Field name="name" component={FormInput} floatingLabel="Name" className="valign-top mr-dialog" validate={[required]}/>
        <Field name="serviceName" component={FormSelect} floatingLabel="Service" options={services} className="valign-top mr-dialog"/>
      </div>
    )
  }
  renderMonitors () {
    const {device, devices, formValues, selectedMonitors, onChangeMonitors} = this.props

    const index = findIndex(devices || [], {id: formValues.deviceId})
    const monitors = devices ? (index < 0 ? [] : devices[index].monitors) : device.monitors

    return (
      <div>
        <Field name="name" component={FormInput} floatingLabel="Name" className="valign-top mr-dialog" validate={[required]}/>
        {devices && this.renderDeviceList()}
        <SelectField multiple floatingLabelText="Monitors" value={selectedMonitors} onChange={onChangeMonitors}>
          {(monitors || []).map((p, i) =>
            <MenuItem
              key={i}
              insetChildren
              checked={selectedMonitors && selectedMonitors.includes(p.uid)}
              value={p.uid}
              primaryText={p.name}
            />
          )}
        </SelectField>
      </div>
    )
  }
  renderServices () {
    const {services, serviceNames, onChangeServiceNames} = this.props
    return (
      <div>
        <Field name="name" component={FormInput} floatingLabel="Name" className="valign-top mr-dialog" validate={[required]}/>
        <SelectField multiple floatingLabelText="Services" value={serviceNames} onChange={onChangeServiceNames} validate={[required]}>
          {(services || []).map((p, i) =>
            <MenuItem
              key={i}
              insetChildren
              checked={serviceNames && serviceNames.includes(p.value)}
              value={p.value}
              primaryText={p.label}
            />
          )}
        </SelectField>
      </div>
    )
  }
  renderInstalledApp () {
    const {devices} = this.props
    const deviceOptions = (devices || []).map(p => ({label: p.name, value: p.id}))

    return (
      <div>
        <Field name="name" component={FormInput} floatingLabel="Name" className="valign-top mr-dialog" validate={[required]}/>
        {devices && <Field key="deviceId" name="deviceId" component={FormSelect} floatingLabel="Device" options={deviceOptions} className="valign-top" validate={[required]}/>}

        <div className="inline-block">
          <Field name="duration" component={FormSelect} floatingLabel="Duration" options={durations} className="valign-top mr-dialog" style={{width: 100}}/>
          <Field name="durationUnit" component={FormSelect} floatingLabel="  "options={gaugeDurationTypes} className="valign-top" style={{width: 120}}/>
        </div>
      </div>
    )
  }
  renderServers () {
    return (
      <div>
        <Field name="name" component={FormInput} floatingLabel="Name" className="valign-top mr-dialog" validate={[required]}/>
        <GaugeServerPicker {...this.props}/>
      </div>
    )
  }

  renderMonitorGroups () {
    return (
      <div>
        <Field name="name" component={FormInput} floatingLabel="Name" className="valign-top mr-dialog" validate={[required]}/>
        <LogicalGroupPicker {...this.props} />
      </div>
    )
  }
  renderLog () {
    return (
      <GaugeLogMonitorPicker {...this.props}/>
    )
  }
  renderContent () {
    const {templateName} = this.props
    switch(templateName) {
      case 'Incident Table':
        return this.renderIncidentTable()
      case 'Cpu':
      case 'Memory':
      case 'Disk':
        return this.renderDevice()
      case 'Service':
        return this.renderService()
      case 'Monitors':
        return this.renderMonitors()
      case 'Installed App':
      case 'Event Log':
      case 'Process':
      case 'Services':
      case 'Users':
      case 'Firewall':
      case 'Network':
      case 'Command':
      case 'CPU/Memory/Disk':
        return this.renderDeviceBasic()
      case 'Servers':
        return this.renderServers()
      case 'Logical Groups':
        return this.renderMonitorGroups()
      case 'Log':
        return this.renderLog()
      case 'Search Shortcuts':
        return this.renderSearchShortcuts()
      default:
        return this.renderNormal()
    }
  }
  render () {
    const {onSubmit, onHide, title} = this.props
    // const width = ['Servers', 'Log'].includes(templateName) ? 950 : 665
    const width = 950
    return (
      <Modal title={title || 'Gauge'} onRequestClose={onHide} contentStyle={{width, maxWidth: 'initial'}}>
        <form onSubmit={onSubmit}>
          <CardPanel className="margin-md-bottom">
            {this.renderContent()}
          </CardPanel>
          <SubmitBlock name="Add" onClick={onHide} />
        </form>
      </Modal>
    )
  }
}
