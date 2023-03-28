import React from 'react';
import { Alert } from 'reactstrap';

const CustomAlert = (props) => {
    return (
        <div>
            <Alert color="primary">
                {props.alert_text}
            </Alert>
        </div>
    );
};

export default CustomAlert;
