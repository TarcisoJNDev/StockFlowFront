import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import FornecedorTela from '../screens/fornecedorTela';
import ProdutoTela from '../screens/produtoTela';
import EstoqueTela from '../screens/estoqueTela';
import ClientesTela from '../screens/clientesTela';
import Home from '../screens/home';

const Tab = createBottomTabNavigator();

export default function TabRoutes() {
    return (
        <Tab.Navigator
            initialRouteName='Home'
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    if (route.name === 'Estoque') {
                        return <MaterialIcons name="inventory" size={size} color={color} />;
                    } else if (route.name === 'Clientes') {
                        return <FontAwesome5 name="user-friends" size={size} color={color} />;
                    } else if (route.name === 'Produtos') {
                        return <MaterialIcons name="qr-code" size={size} color={color} />;
                    } else if (route.name === 'Fornecedor') {
                        return <Ionicons name="business" size={size} color={color} />;
                    } else if (route.name === 'Home') {
                        return <Ionicons name="storefront" size={size} color={color} />;
                    }
                },
                tabBarActiveTintColor: 'green',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen 
                name="Estoque"
                component={EstoqueTela}
            />
            <Tab.Screen 
                name="Clientes"
                component={ClientesTela}
            />
            <Tab.Screen 
                name="Produtos"
                component={ProdutoTela}
            />
            <Tab.Screen 
                name="Fornecedor"
                component={FornecedorTela}
                
            />
            <Tab.Screen 
                name="Home"
                component={Home}
            />
        </Tab.Navigator>
    )
}