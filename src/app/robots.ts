import { MetadataRoute } from 'next'

const robots = (): MetadataRoute.Robots => ({
  rules: [
    {
      userAgent: 'OmniExplorer_Bot',
      disallow: '/'
    },
    {
      userAgent: 'FreeFind',
      disallow: '/'
    },
    {
      userAgent: 'BecomeBot',
      disallow: '/'
    },
    {
      userAgent: 'Nutch',
      disallow: '/'
    },
    {
      userAgent: 'Jetbot/1.0',
      disallow: '/'
    },
    {
      userAgent: 'Jetbot',
      disallow: '/'
    },
    {
      userAgent: 'WebVac',
      disallow: '/'
    },
    {
      userAgent: 'Stanford',
      disallow: '/'
    },
    {
      userAgent: 'naver',
      disallow: '/'
    },
    {
      userAgent: 'dumbot',
      disallow: '/'
    },
    {
      userAgent: 'Hatena Antenna',
      disallow: '/'
    },
    {
      userAgent: 'grub-client',
      disallow: '/'
    },
    {
      userAgent: 'grub',
      disallow: '/'
    },
    {
      userAgent: 'WebZip',
      disallow: '/'
    },
    {
      userAgent: 'larbin',
      disallow: '/'
    },
    {
      userAgent: 'b2w/0.1',
      disallow: '/'
    },
    {
      userAgent: 'Copernic',
      disallow: '/'
    },
    {
      userAgent: 'psbot',
      disallow: '/'
    },
    {
      userAgent: 'Python-urllib',
      disallow: '/'
    },
    {
      userAgent: 'NetMechanic',
      disallow: '/'
    },
    {
      userAgent: 'URL_Spider_Pro',
      disallow: '/'
    },
    {
      userAgent: 'CherryPicker',
      disallow: '/'
    },
    {
      userAgent: 'EmailCollector',
      disallow: '/'
    },
    {
      userAgent: 'EmailSiphon',
      disallow: '/'
    },
    {
      userAgent: 'WebBandit',
      disallow: '/'
    },
    {
      userAgent: 'EmailWolf',
      disallow: '/'
    },
    {
      userAgent: 'ExtractorPro',
      disallow: '/'
    },
    {
      userAgent: 'CopyRightCheck',
      disallow: '/'
    },
    {
      userAgent: 'Crescent',
      disallow: '/'
    },
    {
      userAgent: 'SiteSnagger',
      disallow: '/'
    },
    {
      userAgent: 'ProWebWalker',
      disallow: '/'
    },
    {
      userAgent: 'CheeseBot',
      disallow: '/'
    },
    {
      userAgent: 'LNSpiderguy',
      disallow: '/'
    },
    {
      userAgent: 'Alexibot',
      disallow: '/'
    },
    {
      userAgent: 'Teleport',
      disallow: '/'
    },
    {
      userAgent: 'TeleportPro',
      disallow: '/'
    },
    {
      userAgent: 'Stanford Comp Sci',
      disallow: '/'
    },
    {
      userAgent: 'MIIxpc',
      disallow: '/'
    },
    {
      userAgent: 'Telesoft',
      disallow: '/'
    },
    {
      userAgent: 'Website Quester',
      disallow: '/'
    },
    {
      userAgent: 'moget/2.1',
      disallow: '/'
    },
    {
      userAgent: 'WebZip/4.0',
      disallow: '/'
    },
    {
      userAgent: 'WebStripper',
      disallow: '/'
    },
    {
      userAgent: 'WebSauger',
      disallow: '/'
    },
    {
      userAgent: 'WebCopier',
      disallow: '/'
    },
    {
      userAgent: 'NetAnts',
      disallow: '/'
    },
    {
      userAgent: 'Mister PiX',
      disallow: '/'
    },
    {
      userAgent: 'WebAuto',
      disallow: '/'
    },
    {
      userAgent: 'TheNomad',
      disallow: '/'
    },
    {
      userAgent: 'WWW-Collector-E',
      disallow: '/'
    },
    {
      userAgent: 'RMA',
      disallow: '/'
    },
    {
      userAgent: 'libWeb/clsHTTP',
      disallow: '/'
    },
    {
      userAgent: 'asterias',
      disallow: '/'
    },
    {
      userAgent: 'httplib',
      disallow: '/'
    },
    {
      userAgent: 'turingos',
      disallow: '/'
    },
    {
      userAgent: 'spanner',
      disallow: '/'
    },
    {
      userAgent: 'InfoNaviRobot',
      disallow: '/'
    },
    {
      userAgent: 'Harvest/1.5',
      disallow: '/'
    },
    {
      userAgent: 'Bullseye/1.0',
      disallow: '/'
    },
    {
      userAgent: 'Crescent Internet ToolPak HTTP OLE Control v.1.0',
      disallow: '/'
    },
    {
      userAgent: 'CherryPickerSE/1.0',
      disallow: '/'
    },
    {
      userAgent: 'CherryPickerElite/1.0',
      disallow: '/'
    },
    {
      userAgent: 'WebBandit/3.50',
      disallow: '/'
    },
    {
      userAgent: 'NICErsPRO',
      disallow: '/'
    },
    {
      userAgent: 'Microsoft URL Control - 5.01.4511',
      disallow: '/'
    },
    {
      userAgent: 'DittoSpyder',
      disallow: '/'
    },
    {
      userAgent: 'Foobot',
      disallow: '/'
    },
    {
      userAgent: 'SpankBot',
      disallow: '/'
    },
    {
      userAgent: 'BotALot',
      disallow: '/'
    },
    {
      userAgent: 'lwp-trivial/1.34',
      disallow: '/'
    },
    {
      userAgent: 'lwp-trivial',
      disallow: '/'
    },
    {
      userAgent: 'BunnySlippers',
      disallow: '/'
    },
    {
      userAgent: 'Microsoft URL Control - 6.00.8169',
      disallow: '/'
    },
    {
      userAgent: 'URLy Warning',
      disallow: '/'
    },
    {
      userAgent: 'Wget/1.6',
      disallow: '/'
    },
    {
      userAgent: 'Wget/1.5.3',
      disallow: '/'
    },
    {
      userAgent: 'Wget',
      disallow: '/'
    },
    {
      userAgent: 'LinkWalker',
      disallow: '/'
    },
    {
      userAgent: 'cosmos',
      disallow: '/'
    },
    {
      userAgent: 'moget',
      disallow: '/'
    },
    {
      userAgent: 'hloader',
      disallow: '/'
    },
    {
      userAgent: 'humanlinks',
      disallow: '/'
    },
    {
      userAgent: 'LinkextractorPro',
      disallow: '/'
    },
    {
      userAgent: 'Offline Explorer',
      disallow: '/'
    },
    {
      userAgent: 'Mata Hari',
      disallow: '/'
    },
    {
      userAgent: 'Mata Hari',
      disallow: '/'
    },
    {
      userAgent: 'LexiBot',
      disallow: '/'
    },
    {
      userAgent: 'Web Image Collector',
      disallow: '/'
    },
    {
      userAgent: 'The Intraformant',
      disallow: '/'
    },
    {
      userAgent: 'True_Robot/1.0',
      disallow: '/'
    },
    {
      userAgent: 'True_Robot',
      disallow: '/'
    },
    {
      userAgent: 'BlowFish/1.0',
      disallow: '/'
    },
    {
      userAgent: 'JennyBot',
      disallow: '/'
    },
    {
      userAgent: 'MIIxpc/4.2',
      disallow: '/'
    },
    {
      userAgent: 'BuiltBotTough',
      disallow: '/'
    },
    {
      userAgent: 'ProPowerBot/2.14',
      disallow: '/'
    },
    {
      userAgent: 'BackDoorBot/1.0',
      disallow: '/'
    },
    {
      userAgent: 'toCrawl/UrlDispatcher',
      disallow: '/'
    },
    {
      userAgent: 'WebEnhancer',
      disallow: '/'
    },
    {
      userAgent: 'suzuran',
      disallow: '/'
    },
    {
      userAgent: 'VCI WebViewer VCI WebViewer Win32',
      disallow: '/'
    },
    {
      userAgent: 'VCI',
      disallow: '/'
    },
    {
      userAgent: 'Szukacz/1.4',
      disallow: '/'
    },
    {
      userAgent: 'QueryN Metasearch',
      disallow: '/'
    },
    {
      userAgent: 'Openfind data gathere',
      disallow: '/'
    },
    {
      userAgent: 'Openfind',
      disallow: '/'
    },
    {
      userAgent: 'Xenu\'s Link Sleuth 1.1c',
      disallow: '/'
    },
    {
      userAgent: 'Xenu\'s',
      disallow: '/'
    },
    {
      userAgent: 'Zeus',
      disallow: '/'
    },
    {
      userAgent: 'RepoMonkey Bait & Tackle/v1.01',
      disallow: '/'
    },
    {
      userAgent: 'RepoMonkey',
      disallow: '/'
    },
    {
      userAgent: 'Microsoft URL Control',
      disallow: '/'
    },
    {
      userAgent: 'Openbot',
      disallow: '/'
    },
    {
      userAgent: 'URL Control',
      disallow: '/'
    },
    {
      userAgent: 'Zeus Link Scout',
      disallow: '/'
    },
    {
      userAgent: 'Zeus 32297 Webster Pro V2.9 Win32',
      disallow: '/'
    },
    {
      userAgent: 'Webster Pro',
      disallow: '/'
    },
    {
      userAgent: 'EroCrawler',
      disallow: '/'
    },
    {
      userAgent: 'LinkScan/8.1a Unix',
      disallow: '/'
    },
    {
      userAgent: 'Keyword Density/0.9',
      disallow: '/'
    },
    {
      userAgent: 'Kenjin Spider',
      disallow: '/'
    },
    {
      userAgent: 'Iron33/1.0.2',
      disallow: '/'
    },
    {
      userAgent: 'Bookmark search tool',
      disallow: '/'
    },
    {
      userAgent: 'GetRight/4.2',
      disallow: '/'
    },
    {
      userAgent: 'FairAd Client',
      disallow: '/'
    },
    {
      userAgent: 'Gaisbot',
      disallow: '/'
    },
    {
      userAgent: 'Aqua_Products',
      disallow: '/'
    },
    {
      userAgent: 'Radiation Retriever 1.1',
      disallow: '/'
    },
    {
      userAgent: 'Flaming AttackBot',
      disallow: '/'
    },
    {
      userAgent: 'Oracle Ultra Search',
      disallow: '/'
    },
    {
      userAgent: 'MSIECrawler',
      disallow: '/'
    },
    {
      userAgent: 'PerMan',
      disallow: '/'
    },
    {
      userAgent: 'searchpreview',
      disallow: '/'
    },
    {
      userAgent: 'sootle',
      disallow: '/'
    },
    {
      userAgent: 'es',
      disallow: '/'
    },
    {
      userAgent: 'Enterprise_Search/1.0',
      disallow: '/'
    },
    {
      userAgent: 'Enterprise_Search',
      disallow: '/'
    },
    {
      userAgent: '*',
      disallow: '/wordpress/*'
    },
    {
      userAgent: '*',
      disallow: '/industries/banking-financial-indsurance'
    },
    {
      userAgent: '*',
      disallow: '/industries/transporation-software'
    }
  ],
  sitemap: 'https://www.loginextsolutions.com/sitemap.xml',
})

export default robots
