import Favicon from '../../../src/assets/favicon.png'
const Loader = () => {
  return (
    <>
      <div className="tu-preloader">
        <div className="tu-preloader_holder">
          <img src={Favicon} alt="loader img" />
          <div className="tu-loader"></div>
        </div>
      </div>
    </>
  );
};

export { Loader };
