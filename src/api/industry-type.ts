const getIndustryType = async () => {
  const response = await fetch('/api/industry-type')

  if (!response?.ok) {
    throw new Error('Failed to fetch data')
  }

  return {
    data: await response.json()
  }
}

export { getIndustryType }
