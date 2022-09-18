import { useParams } from "react-router-dom"

const ProductScreen = () => {
    // const params = useParams();
    const {slug} = useParams();
    console.log({slug});
  return (
    <div>
      <h1>{slug}</h1>
    </div>
  )
}

export default ProductScreen
