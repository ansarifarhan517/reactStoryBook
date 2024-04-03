const verifyCompanyName = async (companyName: string, planType: string) => {
  const response = await fetch(`/api/verify-company-name?companyname=${companyName}&planType=${planType}`)

  if (!response?.ok) {
    throw new Error('Failed to fetch data')
  }

  const { status, message } = await response?.json()
  if (status !== 200) {
    return { error: true,
      message: message }
  } else {
    return { error: false,
      message: '' }
  }
}

export { verifyCompanyName }
