import React from 'react';

class Footer extends React.Component{
    constructor(props){
        super(props)
    }

    goBackPage = ()=>{
        this.props.router.replace('/billedit/' + this.props.pk);
    }

    render(){
        return(
            <div className="btn-bottom-fixed">
                <div className="row btn-bottom">
                    <div className="col-sm-12">
                        <button type="button" onClick={this.props.submitClick} className='btn btn-primary fr'>保存</button>
                        <button type="button" onClick={this.goBackPage} className='btn btn-default fr'>取消</button>
                    </div>
                </div>
            </div>
        )
    }
}
export default Footer ;