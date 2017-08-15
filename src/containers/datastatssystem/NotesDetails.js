/**
 * Created by zhangybt on 2017/8/5.
 */
import React from 'react';
import {observer} from 'mobx-react';
import NotesDetailsAjaxStore from "../../stores/datastatssystem/NotesDetailsAjaxStore";
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import Grid from "react-bootstrap/es/Grid";

const notesDetailsAjaxStore = new NotesDetailsAjaxStore();

@observer
export default class NotesDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            EventsDict:"",
        }
    }

    componentDidMount() {
        //初始化位置
    }
    getOption = () =>{

    }

    render() {
        return (
            <Grid/>
        );
    }
}


