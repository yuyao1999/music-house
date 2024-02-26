import { useAudio } from '@/hooks/useAudio'

export const handleDj = (data: any) => {
  if (!data) return ''

  const { aiDjResources } = data
  const { getMusicSearch, createAudioDj } = useAudio()

  const audioUrl = aiDjResources.find((item: any) => item.type === 'audio')?.value?.audioList[0]?.audioUrl
  const songData = aiDjResources.find((item: any) => item.type === 'song')?.value?.songData
  getMusicSearch(songData)
  createAudioDj(audioUrl)
}
