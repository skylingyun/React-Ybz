/**
 * Created by Administrator on 2017/6/22.
 */
import React from 'react';
import {observer} from 'mobx-react';
import {Grid} from 'ssc-grid';
import {Modal, Button} from 'react-bootstrap';
import globalStore from '../../stores/GlobalStore';
import TrainStore  from '../../stores/stdreimburse/StdReimburseTrainStore';
import mobx from 'mobx';
import Config from '../../config';
import {Refers} from 'ssc-refer';
import Checkbox from 'rc-checkbox';

@observer
class Traffic extends React.Component {
    render(){
        return(
            <div>test</div>
        )
    }

}
export default Traffic ;