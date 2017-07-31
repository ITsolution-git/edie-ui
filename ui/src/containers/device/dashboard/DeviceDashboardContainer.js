import React from 'react'
import DeviceDashboard from 'components/dashboard/map/device/dashboard/DeviceDashboard'
import {withRouter} from 'react-router'
import { connect } from 'react-redux'

import {
  fetchSysSearchOptions,
  fetchWorkflows,

  fetchGauges,
  addDeviceGauge,
  updateDeviceGauge,
  removeDeviceGauge,

  fixIncident,
  ackIncident
} from 'actions'

class DeviceDashboardContainer extends React.Component {
  render () {
    return (
      <DeviceDashboard {...this.props} />
    )
  }
}
export default connect(
  state => ({
    device: state.dashboard.selectedDevice,

    gauges: state.gauge.gauges,

    mapDevices: state.devices.mapDevices,
    mapLines: state.devices.mapLines,

    userInfo: state.dashboard.userInfo,
    sysSearchOptions: state.search.sysSearchOptions,
    workflows: state.settings.workflows,

    incidentDraw: state.devices.incidentDraw
  }), {
    fetchSysSearchOptions,
    fetchWorkflows,

    fetchGauges,
    addDeviceGauge,
    updateDeviceGauge,
    removeDeviceGauge,

    fixIncident,
    ackIncident
  }
)(withRouter(DeviceDashboardContainer))
