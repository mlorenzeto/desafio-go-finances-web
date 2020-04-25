import moment from 'moment';

const formatDate = (value: Date): string => moment(value).format('DD/MM/YYYY');

export default formatDate;
