// https://codepen.io/chris__sev/pen/JjRqOxa

function Loader() {
  return (
    <div
      className="bg-primary/20 p-5 rounded-full flex space-x-3"
      style={{ animationDuration: '0.5s' }}
    >
      <div
        className="w-5 h-5 bg-primary rounded-full animate-bounce"
        style={{ animationDelay: '0.1s' }}
      />
      <div
        className="w-5 h-5 bg-primary rounded-full animate-bounce"
        style={{ animationDelay: '0.3s' }}
      />
      <div
        className="w-5 h-5 bg-primary rounded-full animate-bounce"
        style={{ animationDelay: '0.5s' }}
      />
    </div>
  )
}

export default Loader
