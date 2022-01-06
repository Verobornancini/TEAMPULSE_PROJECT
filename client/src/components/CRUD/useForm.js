import { useState } from "react";

const useForm = (initialFieldValues, setCurrentId) => {

    const [values, setValues] = useState(initialFieldValues)
    const [errors, setErrors] = useState({})

    const handleInputChange = e => {
        console.log(e.target)
        const { name, value } = e.target
        console.log(value)
        console.log(name)
        if (name === "") {
            setValues({
                ...values,
                equipo: value
            })
        } else {

            setValues({
                ...values,
                [name]: value
            })
        }
    }

    const resetForm = () => {
        setValues(initialFieldValues)
        setErrors({})
        setCurrentId(0)
    }

    return {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    };
}

export default useForm;
