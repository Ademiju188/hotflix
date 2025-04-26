import React from "react";

type InputErrorProp = {
    message?: string;
}

const InputError: React.FC<InputErrorProp> = ({ message }) => {
    return (
        <div>
            <p className="text-sm text-danger fw-bold">
                {message}
            </p>
        </div>
    )
};

export default InputError;
