
import { createNativeStackNavigator} from '@react-navigation/native-stack';

import Login from '../screens/Auth/login';
import TelaInicial from '../screens/Outros/telaInicial';
import CriarConta from '../screens/Auth/criarConta';
import AjudaWhats from '../screens/Outros/ajudaWhats';
import CadastroProduto from '../screens/Produto/cadastroProduto';
import CadastroFornecedor from '../screens/Fornecedor/cadastroFornecedor';
import CadastroClientes from '../screens/Cliente/cadastroClientes';
import CadastroEstoque from '../screens/Estoque/cadastroEstoque';
import EntradaEstoque from '../screens/Estoque/entradaEstoque';
import RetiradaEstoque from '../screens/Estoque/retiradaEstoque';
import FiltroEstoque from '../screens/Estoque/filtroEstoque';
import CategoriaTela from '../screens/Categoria/categoriaTela';
import TabRoutes from './tab.routes';
import UsuarioTela from '../screens/GerenciamentoUsuario/usuarioTela';
import CadastroCategoria from '../screens/Categoria/cadastroCategoria';
import CadastroUsuario from '../screens/GerenciamentoUsuario/cadastroUsuario';
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