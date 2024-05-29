import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Welcome from '../pages/Welcome';
import SignIn from '../pages/SignIn';
import Cadastro from '../pages/Cadastro';
import RecuperarSenha from '../pages/RecuperarSenha';

const Stack= createNativeStackNavigator();

export default function Routes(){
    return(
        <Stack.Navigator>
            
            <Stack.Screen
            name="Welcome"
            component={Welcome}
            options={{headerShown: false}} 
            />
            <Stack.Screen 
            name="SignIn"
            component={SignIn}
            options={{headerShown: false}} 
            /> 
            <Stack.Screen 
            name="RecuperarSenha"
            component={RecuperarSenha}
            options={{headerShown: false}} 
            />
            <Stack.Screen 
            name="Cadastro"
            component={Cadastro}
            options={{headerShown: false}} 
            />
           
        </Stack.Navigator>
    )
    

}

    