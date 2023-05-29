import { Form, redirect, useActionData, useLoaderData, useNavigate } from "react-router-dom";
import Error from "../components/Error";
import Formulario from "../components/Formulario";
import { obtenerCliente, actualizarCliente } from "../data/clientes";

export async function loader({ params }) {
  const cliente = await obtenerCliente(params.clienteId)

  if(Object.values(cliente).length === 0) {
    throw new Response('', {
      status: 404,
      statusText: 'El cliente no fue encontrado'
    })
  }
  return cliente;
}

export async function action({request, params}) {
  const formData = await request.formData()
  const datos = Object.fromEntries(formData)
  const email = formData.get('email')

  const errores = []
  if(Object.values(datos).includes('')) {
    errores.push('Todos los campos son obligatorios')
  }

  let regex = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");

  if(!regex.test(email)) {
    errores.push('El Email no es válido')
  }

  if(Object.keys(errores).length) {
    return errores;
  }

  await actualizarCliente(params.clienteId, datos)
  return redirect('/')
}

const EditarCliente = () => {
  const cliente = useLoaderData()
  const errores = useActionData()
  const navigate = useNavigate()

  return (
    <>
      <h1 className="font-black text-4xl text-blue-900">Editar clientes</h1>
      <p className="mt-3">Cambia los campos que quieras para editar el cliente</p>

      <div className="flex justify-end">
        <button
          className="bg-blue-800 text-white px-3 py-1 font-bold uppercase"
          onClick={() => navigate(-1)}
        >Volver</button>
      </div>

      <div className="bg-white shadow rounded-md md:w-3/4 mx-auto px-5 py-10 mt-20">
        { errores?.length && errores.map( (error, i) => <Error key={i}>{error}</Error> ) }

        <Form
          method="post"
          noValidate
        >
          <Formulario 
            cliente={cliente}
          />
          <input 
            type="submit" 
            className="mt-5 w-full bg-blue-800 p-3 uppercase font-bold text-white text-lg"
            value="Guardar Cambios"
          />
        </Form>
      </div>
    </>
  )
}

export default EditarCliente