/**
 * Created by liuyyg on 2017/5/8.
 */
/**
 *  账簿切换组件
 */
import React from 'react';
import { observer } from 'mobx-react';
import GlobalStore from '../stores/GlobalStore'
import mobx from 'mobx';

const globalStore = GlobalStore;

@observer
class Accbook extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            accBooks:globalStore.getAllAcc,
            default:globalStore.getDefaultAcc
        }
    }

    componentDidMount() {
        // globalStore.queryAllAcc();
        // globalStore.queryDefaultAcc();
    }

    accChanged = (e) => {
        let value = e.target.value;
        if(this.props.onChange)
            this.props.onChange(value);
        this.setState({default:value})
        globalStore.accBookDefault = value;
    }

    render() {
        return (
            <div className="accbook mr20 fl">
                <span className="books">账簿:</span>
                <select onChange={this.accChanged.bind(this)} className="form-control"
                        defaultValue={this.state.default}>
                    {this.state.accBooks.map((val, index) => {
                        return (<option key={ 'option' + index } value={ val.id } >{ val.name }</option>)
                    })}
                </select>
            </div>
        )
    }
}


export default Accbook;