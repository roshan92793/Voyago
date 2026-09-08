import './Loader.css';

const Loader = ({ fullscreen = false, message = 'Loading...' }) => {
  return (
    <div className={`loader ${fullscreen ? 'loader--fullscreen' : ''}`}>
      <div className="loader__ring">
        <div /><div /><div /><div />
      </div>
      {message && <p className="loader__message">{message}</p>}
    </div>
  );
};

export default Loader;
