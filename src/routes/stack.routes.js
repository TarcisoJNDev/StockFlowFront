
import { createNativeStackNavigator} from '@react-navigation/native-stack';

import Login from '../screens/login';
import TelaInicial from '../screens/telaInicial';
import CriarConta from '../screens/criarConta';
import AjudaWhats from '../screens/ajudaWhats';
import CadastroProduto from '../screens/cadastroProduto';
import CadastroFornecedor from '../screens/cadastroFornecedor';
import CadastroClientes from '../screens/cadastroClientes';
import CadastroEstoque from '../screens/cadastroEstoque';
import EntradaEstoque from '../screens/entradaEstoque';
import RetiradaEstoque from '../screens/retiradaEstoque';
import FiltroEstoque from '../screens/filtroEstoque';
import CategoriaTela from '../screens/categoriaTela';
import TabRoutes from './tab.routes';
import UsuarioTela from '../screens/usuarioTela';
import CadastroCategoria from '../screens/cadastroCategoria';
import CadastroUsuario from '../screens/cadastroUsuario';
const Stack = createNativeStackNavigator();

export default function StackRoutes() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen 
                name="TelaInicial"
                component={TelaInicial}
            />
            <Stack.Screen 
                name="Login"
                component={Login}
            />
            <Stack.Screen 
                name="CriarConta"
                component={CriarConta}
            />
            <Stack.Screen 
                name="AjudaWhats"
                component={AjudaWhats}
            />
            <Stack.Screen 
                name="Home"
                component={TabRoutes}
            />
            <Stack.Screen 
                name="CadastroProduto"
                component={CadastroProduto}
            />
            <Stack.Screen 
                name="CadastroFornecedor"
                component={CadastroFornecedor}
            />
            <Stack.Screen 
                name="CadastroClientes"
                component={CadastroClientes}
            />
            <Stack.Screen 
                name="CadastroEstoque"
                component={CadastroEstoque}
            />
            <Stack.Screen 
                name="EntradaEstoque"
                component={EntradaEstoque}
                options={{ presentation: 'modal'}}
            />
            <Stack.Screen 
                name="RetiradaEstoque"
                component={RetiradaEstoque}
            />
            <Stack.Screen 
                name="FiltroEstoque"
                component={FiltroEstoque}
            />
            <Stack.Screen 
                name="CategoriaTela"
                component={CategoriaTela}
            />
            <Stack.Screen 
                name="UsuarioTela"
                component={UsuarioTela}
            />
            <Stack.Screen 
                name="CadastroCategoria"
                component={CadastroCategoria}
            />
            <Stack.Screen 
                name="CadastroUsuario"
                component={CadastroUsuario}
            />
        </Stack.Navigator>
    )
}