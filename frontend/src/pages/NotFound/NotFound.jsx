import Error from '../../components/Error/Error';

const NotFound = () => (
  <Error
    code="404"
    title="Lost in Transit"
    message="This page doesn't exist or the destination was moved. Let's get you back on track."
    showHome
  />
);

export default NotFound;
