/**
 * 第三步 发布部署
 */
import React from 'react';
import {observer} from 'mobx-react';
import {Grid} from 'ssc-grid';
import {Modal, Button} from 'react-bootstrap';
import globalStore from '../../stores/GlobalStore';

class Deploy extends React.Component{
    render(){
        return(
            <div className={this.props.show? "":"hide"}>
                Deploy
                不能再点击了 。我也不知道为什么 。
            </div>
        )
    }
}
export default Deploy;