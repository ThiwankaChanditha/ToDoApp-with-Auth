import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native';
import supabase from '../supabase';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        const checkUserSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                navigation.navigate("TaskList");
            }
        };

        checkUserSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
                navigation.navigate("TaskList");
            }
        });

        return () => {
            subscription?.unsubscribe();
        };
    }, [navigation]);

   
    const handleSignUp = async () => {
        try {
            const { user, error } = await supabase.auth.signUp({ email, password });
            if (error) throw error;
            console.log('Signed up with:', user.email);
        } catch (error) {
            alert(error.message);
        }
    };

    
    const handleLogin = async () => {
        try {
            const { user, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            console.log('Logged in with:', user.email);
            navigation.navigate("TaskList"); 
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior='padding'
        >
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder='Email'
                    value={email}
                    onChangeText={text => setEmail(text)}
                    style={styles.input}
                />
                <TextInput
                    placeholder='Password'
                    value={password}
                    onChangeText={text => setPassword(text)}
                    style={styles.input}
                    secureTextEntry
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={handleLogin}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleSignUp}
                    style={[styles.button, styles.buttonOutline]}
                >
                    <Text style={styles.buttonOutlineText}>Register</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    inputContainer: {
        width: '80%',
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    button: {
        backgroundColor: '#0782F9',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: '#0782F9',
        borderWidth: 2,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlineText: {
        color: '#0782F9',
        fontWeight: '700',
        fontSize: 16,
    },
});

export default LoginScreen;
