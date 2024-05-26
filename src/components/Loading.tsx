import { Oval } from 'react-loader-spinner'

const Loading = () => {
  return (
    <div className="flex items-center justify-center mt-28 fadeIn">
      <Oval
        visible={true}
        height="150"
        width="150"
        color="#76ABAE"
        ariaLabel="oval-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  )
}

export default Loading
