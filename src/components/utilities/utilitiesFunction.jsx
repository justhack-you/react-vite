import toast from 'react-hot-toast';

export const validationCheck = (res) => {
    res.data.forEach((error) => {
        toast.error(error.msg);
    });
}

export default validationCheck