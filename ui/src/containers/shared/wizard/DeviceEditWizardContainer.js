import React from 'react'
import DeviceEditWizard from 'components/common/wizard/DeviceEditWizard'
import { connect } from 'react-redux'
import {
  openTplImageModal,
  closeTplImageModal,
  fetchImages,
  uploadImage,

  showDeviceTagModal,
  updateDeviceTags,

  updateDeviceCreds,
  showDeviceCredsPicker,
  selectDeviceCreds,

  installAgent,
  uninstallAgent,

  fetchCredentials,
  addCredentials,
  updateCredentials,
  removeCredentials,
  fetchCredTypes,

  fetchCollectors,
  showCollectorModal,
  addCollector,

  fetchMonitorTemplates,
  openDeviceMonitorWizard
} from 'actions'

import {getRemoveAfter} from 'shared/Global'

class DeviceEditWizardContainer extends React.Component {
  render () {
    return (
      <DeviceEditWizard {...this.props} />
    )
  }
}

DeviceEditWizard.defaultProps = {
  deviceType: '',

  extraParams: {},
  configParams: {},

  onSaved: null,
  onFinish: null,

  tabs: [{
    title: 'Basic',
    include: ['wanip', 'name', 'hostname'/*, 'image', 'lanip', 'agentid'*/],
    width: 6
  }, {
    title: 'Agent',
    include: ['agent'],
    width: 6,
  }/*, {
    title: 'Advanced',
    id: 'tab-devinfo-advanced',
    include: ['server_url', 'deviceid', 'devicetype', 'response', 'checkinterval', 'status', 'basicchecks', 'externalIP', 'tags', 'params.remove_after'],
    extra: [{
      name: 'id',
      title: 'DeviceId'
    }, {
      name: 'templateName',
      title: 'Template Name'
    }],
    width: 6
  }, {
    title: 'Credentials',
    include: ['credentials'],
    width: 12
  }*/]
}

export default connect(
  state => ({
    initialValues: {
      ...state.dashboard.selectedDevice,
      ...getRemoveAfter(state.dashboard.selectedDevice),
    },

    selectedDevice: state.dashboard.selectedDevice,

    tplImageModalVisible: state.settings.tplImageModalVisible,
    selectedTplImage: state.settings.selectedTplImage,

    images: state.dashboard.images,

    deviceTagModalOpen: state.devices.deviceTagModalOpen,
    deviceTags: state.devices.deviceTags,
    deviceCreds: state.devices.deviceCreds,
    deviceCredsPickerVisible: state.devices.deviceCredsPickerVisible,
    selectedDeviceCreds: state.devices.selectedDeviceCreds,

    credentials: state.settings.credentials,
    credentialTypes: state.settings.credentialTypes,

    collectors: state.settings.collectors,
    collectorModalOpen: state.settings.collectorModalOpen,

    monitorTemplates: state.settings.monitorTemplates,
    deviceTemplates: state.settings.deviceTemplates,
    deviceMonitorsModalOpen: state.devices.deviceMonitorsModalOpen,

    installAgentMessage: state.devices.installAgentMessage
  }), {
    openTplImageModal,
    closeTplImageModal,
    fetchImages,
    uploadImage,

    showDeviceTagModal,
    updateDeviceTags,

    updateDeviceCreds,
    showDeviceCredsPicker,
    selectDeviceCreds,

    installAgent,
    uninstallAgent,

    fetchCredentials,
    addCredentials,
    updateCredentials,
    removeCredentials,
    fetchCredTypes,

    fetchCollectors,
    showCollectorModal,
    addCollector,

    fetchMonitorTemplates,
    openDeviceMonitorWizard
  }
)(DeviceEditWizardContainer)
