import React from 'react'

import {
    Modal,
    CardPanel
} from 'components/modal/parts'
import {Button} from '@material-ui/core'
import AppletCard from 'components/common/AppletCard'
import { 
    extImageBaseUrl, 
    appletColors as colors,
    trimOSName
} from 'shared/Global'

export default class MapItemModalView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isClickedDevice: false,
            selectedDevice: null
        }
    }

    onClickDevice(device) {
        this.setState({selectedDevice: device, isClickedDevice: true});
    }

    renderDeviceList() {
        const {devices, selIndex} = this.props
        return (
            <CardPanel title="Devices">
                <div style={{maxHeight: 300, overflow: 'auto'}}>
                    {devices.map((device, index) => (
                        <AppletCard 
                            key={device.id}
                            selected={selIndex}
                            color={colors[index % colors.length]}
                            name={device.templateName || 'Unknown'}
                            desc={device.name}
                            desc2={<span>{trimOSName(device.osDetails)}<br/>{device.wanip || ''}</span>}
                            desc3={device.hostname || 'Unknown'}
                            onClick={() => this.onClickDevice(device)}
                            titleLimit={15}
                            img={`${extImageBaseUrl}${device.image}`}
                        />
                    ))}
                </div>
            </CardPanel>
        )
    }

    renderMonitors() {
        const {devices, selIndex} = this.props
        return (
            <CardPanel title="Monitors" isBack={true} onBack={() => this.setState({isClickedDevice: false})}>
                <div style={{maxHeight: 300, overflow: 'auto'}}>
                    {devices.map((device, index) => (
                        <AppletCard 
                            key={device.id}
                            selected={selIndex}
                            color={colors[index % colors.length]}
                            name={device.templateName || 'Unknown'}
                            desc={device.name}
                            desc2={<span>{trimOSName(device.osDetails)}<br/>{device.wanip || ''}</span>}
                            desc3={device.hostname || 'Unknown'}
                            onClick={() => this.onClickDevice(device)}
                            titleLimit={15}
                            img={`${extImageBaseUrl}${device.image}`}
                        />
                    ))}
                </div>
            </CardPanel>
        )
    }

    getProductByDevice (product) {
        const {devices} = this.props        
        let device = devices.filter(device => device.id === this.state.selectedDevice.id)[0]
        return device.productIds && device.productIds.includes(product.id);
    }

    onClickProductDevice(deviceName) {
        const { productsWithInsDevs, selectedItem } = this.props
        let product = productsWithInsDevs[selectedItem.index]
        let productDeviceId = product.deviceNamesAndInstances[deviceName];
        this.props.onClickRow(productDeviceId, product);
    }

    renderProducts () {
        const { allDevices, productsWithInsDevs, selIndex, selectedItem} = this.props
        let product = productsWithInsDevs[selectedItem.index]
        let devices = allDevices.filter(device => Object.keys(product.deviceNamesAndInstances).includes(device.name))
        return (
            <CardPanel title="Products">
                <div style={{maxHeight: 300, overflow: 'auto'}}>
                    {devices.map((device, index) => (
                        <AppletCard 
                            key={device.id}
                            selected={selIndex}
                            color={colors[index % colors.length]}
                            name={device.templateName || 'Unknown'}
                            desc={device.name}
                            desc2={<span>{trimOSName(device.osDetails)}<br/>{device.wanip || ''}</span>}
                            desc3={device.hostname || 'Unknown'}
                            onClick={() => this.onClickProductDevice(device.name)}
                            titleLimit={15}
                            img={`${extImageBaseUrl}${device.image}`}
                        />
                    ))}
                </div>
            </CardPanel>
        )
    }

    renderContent() {
        const {type} = this.props
        if (!this.state.isClickedDevice && type !== 'PRODUCT') {
            return this.renderDeviceList()
        }

        switch (type) {
            case 'DEVICE':
                return this.renderDeviceList()
            case 'MONITOR':
                return this.renderMonitors()
            case 'PRODUCT':
                return this.renderProducts()
            default:
                return null
        }
    }


    render() {
        const {onSubmit, onClose} = this.props
        return (
            <Modal title="Map Item" onRequestClose={onClose}>
                <form onSubmit={onSubmit}>
                    {this.renderContent()}

                    <div className="padding-md">
                        <Button variant="raised" type="submit" className="margin-md-top">OK</Button>
                    </div>
                </form>
            </Modal>
        )
    }
}