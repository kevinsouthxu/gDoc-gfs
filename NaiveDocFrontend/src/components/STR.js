import React from 'react'
import {Card, Tag, Row, Button, Popconfirm, Col, Modal, Space, Input, message} from 'antd'
import '../css/STR.css'
import { Link } from 'react-router-dom'
import * as SheetService from "../services/SheetService";
import {apiUrl} from "../constant";
// import * as STRService from "../services/SingleTurtleRoomService";

export class STR extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            roominfo: {},
            loading: false,
            visible: false,
            visible_del: false,
            user: {}
        }
        this.websocket = null;
        this.onMessage = this.onMessage.bind(this);
    }

    onMessage(event) {
        console.log(event.data)
        let msg = JSON.parse(event.data);
        if (msg.type == "MTTERROR") {
            let msg = "There are other users are editing now!"
            message.error(msg);
        }
        if (msg.type == "MTTSUCCESS") {
            this.websocket.close()
            window.location = '/Sheet/roomlist';
        }
        if (msg.type == "RECOVERET") {
            this.websocket.close()
            window.location = '/Sheet/roomlist';
        }
        if (msg.type == "CREATESUCCESS2") {
            this.websocket.close()
            window.location = '/Sheet/roomlist';
        }
    }

    handleDelete = () => {
        this.setState({ loading: true });
        setTimeout(() => {
            this.setState({ loading: false, visible_del: false });
        }, 3000 );
        let filename = this.state.roominfo.roomname;

        let Message = {
            type: "mtt",
            filename: filename,
            username: this.state.user.username
        }

        let jsonStr = JSON.stringify(Message);
        this.websocket.send(jsonStr);
    }
    handleCancel = () => {
        this.setState({ visible: false });
    };
    handleCancelDel = () => {
        this.setState({ visible_del: false });
    };
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    showModalDel = () => {
        this.setState({
            visible_del: true,
        });
    };
    handleOk = () => {
        this.setState({ loading: true });
        setTimeout(() => {
            this.setState({ loading: false, visible: false });
        }, 3000);

        let filename = this.state.roominfo.roomname;

        let Message = {
            type: "enter",
            filename: filename
        }
        // let jsonStr = JSON.stringify(Message);
        // this.websocket.send(jsonStr);

        SheetService.enterRoom(Message)
    };
    componentDidMount() {
        let user = JSON.parse(localStorage.getItem('user'));
        this.setState({user: user});

        this.setState({ roominfo: this.props.info})
        console.log(this.props.info)
        const url = `${apiUrl}/ws`
        this.websocket = new WebSocket(url);
        this.websocket.onmessage = this.onMessage;
        this.websocket.onopen = () => {
            let Message = {
                type: "connect"
            }
            let jsonStr = JSON.stringify(Message);
            this.websocket.send(jsonStr);

        };
        this.websocket.onclose = function (e) {
            console.log('websocket ??????: ' + e.code + ' ' + e.reason + ' ' + e.wasClean)
            console.log(e)
            let Message = {
                type: "close",
                filename: ""
            }
            let jsonStr = JSON.stringify(Message);
            this.websocket.send(jsonStr);
        }
    }

    render() {

        const { visible, loading, visible_del } = this.state;
        return (
            <Card
                title={
                    <div>
                        <b>{this.state.roominfo.roomname}</b>
                    </div>
                }
                hoverable
                class='Task_Blower'
                extra={
                    <>
                        <Button type="primary" onClick={this.showModalDel}>
                           ????????????
                        </Button>
                        <Modal
                            title="????????????"
                            visible={visible_del}



                            footer={[
                                <Button key="back" onClick={this.handleCancelDel}>
                                    ??????
                                </Button>,
                                <Button key="submit" type="primary" loading={loading} onClick={this.handleDelete}>
                                    ????????????
                                </Button>,
                            ]}
                        >
                        </Modal>

                        <Button type="primary" onClick={this.showModal}>
                            ????????????
                        </Button>
                        <Modal
                            title="????????????"
                            visible={visible}



                            footer={[
                                <Button key="back" onClick={this.handleCancel}>
                                    ??????
                                </Button>,
                                <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
                                    ??????
                                </Button>,
                            ]}
                        >
                        </Modal>
                      </>

                }
            >
            </Card>
        )
    }
}