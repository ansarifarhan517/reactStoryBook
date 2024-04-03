const verifyEmail = async (email: string) => {
  const response = await fetch(`/api/verify-email?email=${email}`)

  if (!response?.ok) {
    throw new Error('Failed to fetch data')
  }

  const { code, message } = await response?.json()
  if (code !== 200) {
    return { error: true,
      message: message }
  } else {
    return { error: false,
      message: '' }
  }
}

export { verifyEmail }
