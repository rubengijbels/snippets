import { useTranslation as useI18nextTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from 'react'
//import clientCookies from 'js-cookie'
import { isServer, prefersDarkMode } from './functions'
import { not } from 'ramda'

import { debounce } from 'debounce'
import { FieldPath, RegisterOptions, UseFormRegister, UseFormRegisterReturn, UseFormTrigger } from 'react-hook-form'

export const registerFieldWithDebounceValidation = <TFieldValues>(
  name: FieldPath<TFieldValues>,
  delay: number,
  trigger: UseFormTrigger<TFieldValues>,
  register: UseFormRegister<TFieldValues>,
  options?: RegisterOptions<TFieldValues, FieldPath<TFieldValues>>
) => {
  const useFormRegisterReturn: UseFormRegisterReturn = register(name, options)
  const { onChange } = useFormRegisterReturn
  const debouncedValidate = debounce(
    () => {
      trigger(name)
    },
    delay,
    null
  )
  return {
    ...useFormRegisterReturn,
    onChange: (e: any) => {
      onChange(e)
      debouncedValidate()
    },
  }
}

export const useStateWithLocalStorageSync = <T>(
  key: string,
  defaultValue: T | undefined
): [T | undefined, Dispatch<SetStateAction<T | undefined>>] => {
  let initialValue = defaultValue
  if (!isServer()) {
    const localStorageValue = localStorage.getItem(key)
    if (localStorageValue != null) initialValue = JSON.parse(localStorageValue)
  }

  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [value, key])

  return [value, setValue]
}

// export const useStateWithCookieSync = <T>(
//   key: string,
//   defaultValue: T | undefined
// ): [T | undefined, Dispatch<SetStateAction<T | undefined>>] => {
//   let initialValue = defaultValue

//   if (!isServer()) {
//     const cookieValue = clientCookies.get(key)
//     if (cookieValue != null) initialValue = JSON.parse(cookieValue)
//   }

//   const [value, setValue] = useState(initialValue)

//   useEffect(() => {
//     clientCookies.set(key, JSON.stringify(value))
//   }, [value, key])

//   return [value, setValue]
// }

export const useHasMounted = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}

export const useTranslation = (module: string) => {
  const { t: translate, i18n } = useI18nextTranslation(module)
  const { t: translateCommon } = useI18nextTranslation('common')
  const { t: translateApi } = useI18nextTranslation('api')

  const t = useMemo(() => translate, []) //eslint-disable-line react-hooks/exhaustive-deps
  const tc = useMemo(() => translateCommon, []) //eslint-disable-line react-hooks/exhaustive-deps
  const ta = useMemo(() => translateApi, []) //eslint-disable-line react-hooks/exhaustive-deps
  const router = useRouter()

  return {
    t,
    tc,
    ta,
    language: i18n.language,
    languages: ['en', 'de', 'fr'],
    changeLanguage: (language: string) => {
      const { pathname, asPath, query } = router
      router.push({ pathname, query }, asPath, { locale: language })
    },
  }
}

export const useBoolean = (initialValue: boolean) => {
  const [value, setValue] = useState(initialValue)
  const toggle = () => setValue(not)
  return [value, toggle] as const
}
