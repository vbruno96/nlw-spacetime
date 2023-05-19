import { useEffect } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { StatusBar } from 'expo-status-bar'
import { useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session'

import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'

import { api } from '../src/lib/api'

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/oauth/access_token',
  revocationEndpoint:
    'https://github.com/settings/connections/applications/24cc1bf489db331ad588',
}

export default function App() {
  const [, response, signInWithGithub] = useAuthRequest(
    {
      clientId: '24cc1bf489db331ad588',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'nlwspacetime',
      }),
    },
    discovery,
  )

  const router = useRouter()

  async function handleGithubbOAuthCode(code: string) {
    const response = await api.post('/register', { code })
    const { token } = response.data
    await SecureStore.setItemAsync('token', token)
    router.push('/memories')
  }

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params
      handleGithubbOAuthCode(code)
    }
  }, [response])

  return (
    <View className="relative flex-1 items-center px-8">
      <View className="flex-1 items-center justify-center gap-6">
        <NLWLogo />

        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>
          <Text className="text-body text-center text-base leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-full bg-green-500 px-5 py-2"
          onPress={() => signInWithGithub()}
        >
          <Text className="font-alt text-sm uppercase text-black">
            Começar a cadastrar
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-center font-body text-sm leading-relaxed text-gray-200">
        Feito com 💜 no NLW da Rocketseat
      </Text>

      <StatusBar style="light" translucent />
    </View>
  )
}
