import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface Channel {
  id: number;
  name: string;
  slug: string;
  subscribers: number;
  category: string;
  admin: string;
  lastChecked: string;
  status: 'active' | 'inactive';
  description: string;
  tgLink: string;
  language: string;
  postsPerDay: number;
  avgViews: number;
  contacts: string[];
}

const API_URL = 'https://functions.poehali.dev/e7b44188-edc8-4271-996e-a3ca0efd9370';
const EXPORT_URL = 'https://functions.poehali.dev/fb020deb-3889-4882-aa77-eabbb5cefc0b';

const mockJobs = [
  { id: 231, name: 'Полный скан', status: 'running', progress: 67 },
  { id: 230, name: 'Повторный сбор', status: 'failed', progress: 0 },
  { id: 229, name: 'Снимок данных', status: 'completed', progress: 100 },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [totalChannels, setTotalChannels] = useState(0);

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async (query = '') => {
    setLoading(true);
    try {
      const url = query ? `${API_URL}?query=${encodeURIComponent(query)}` : API_URL;
      const response = await fetch(url);
      const data = await response.json();
      setChannels(data.channels || []);
      setTotalChannels(data.total || 0);
    } catch (error) {
      console.error('Ошибка загрузки каналов:', error);
    } finally {
      setLoading(false);
    }
  };

  const startScraping = async () => {
    setScraping(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      alert(data.message || 'Парсинг завершён!');
      fetchChannels();
    } catch (error) {
      console.error('Ошибка парсинга:', error);
      alert('Ошибка при запуске парсинга');
    } finally {
      setScraping(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value.length > 2 || value.length === 0) {
      fetchChannels(value);
    }
  };

  const exportToExcel = async (format: 'xlsx' | 'csv' = 'xlsx') => {
    try {
      const response = await fetch(`${EXPORT_URL}?format=${format}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tgstat_channels.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Ошибка экспорта:', error);
      alert('Ошибка при экспорте данных');
    }
  };

  const stats = [
    { label: 'Собрано каналов', value: totalChannels.toLocaleString(), trend: `В базе`, icon: 'Database' },
    { label: 'Активных задач', value: '3', trend: 'Очередь: Celery', icon: 'Activity' },
    { label: 'Ошибок (24ч)', value: '2', trend: 'Алерты включены', icon: 'AlertCircle', variant: 'destructive' },
    { label: 'Готово к экспорту', value: '5', trend: 'Последний: 11 ноя', icon: 'FileDown' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
      <div className="flex">
        <aside className="w-64 min-h-screen bg-white border-r border-gray-200 p-6">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">
                TG
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">TGStat Парсер</h1>
                <p className="text-xs text-gray-500">Production v1.0</p>
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-200'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon name="LayoutDashboard" size={18} />
              Дашборд
            </button>
            <button
              onClick={() => setActiveTab('scrape')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'scrape'
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-200'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon name="Play" size={18} />
              Управление
            </button>
            <button
              onClick={() => setActiveTab('channels')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'channels'
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-200'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon name="Radio" size={18} />
              Каналы
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'jobs'
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-200'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon name="ListChecks" size={18} />
              Задачи
            </button>
          </nav>

          <div className="mt-8 pt-6 border-t border-gray-200 space-y-3 text-sm">
            <div className="flex items-center justify-between text-gray-600">
              <span>Прокси</span>
              <span className="font-semibold text-gray-900">12</span>
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span>Очередь</span>
              <span className="font-semibold text-gray-900">4</span>
            </div>
            <div className="text-xs text-gray-500 pt-2">
              Последняя задача: <span className="font-medium">11 ноя, 10:12</span>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-8">
          <header className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">
                {activeTab === 'dashboard' && 'Дашборд'}
                {activeTab === 'scrape' && 'Управление парсингом'}
                {activeTab === 'channels' && 'Каналы'}
                {activeTab === 'jobs' && 'Задачи и логи'}
              </h2>
              <p className="text-gray-600">
                {activeTab === 'dashboard' && 'Мониторинг и статистика парсера'}
                {activeTab === 'scrape' && 'Управление задачами парсинга'}
                {activeTab === 'channels' && 'База собранных каналов'}
                {activeTab === 'jobs' && 'История и логи выполнения'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2">
                <Icon name="Settings" size={16} />
                Настройки
              </Button>
              <Button 
                className="gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-200"
                onClick={startScraping}
                disabled={scraping}
              >
                <Icon name="Play" size={16} />
                {scraping ? 'Парсинг...' : 'Запустить полный скан'}
              </Button>
            </div>
          </header>

          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                  <Card key={idx} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-2.5 rounded-lg ${stat.variant === 'destructive' ? 'bg-red-100' : 'bg-indigo-100'}`}>
                          <Icon name={stat.icon as any} size={20} className={stat.variant === 'destructive' ? 'text-red-600' : 'text-indigo-600'} />
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-1 tabular-nums">{stat.value}</div>
                      <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
                      <div className="text-xs text-gray-500">{stat.trend}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Icon name="TrendingUp" size={20} className="text-indigo-600" />
                      Динамика сбора
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { date: '11 ноя', channels: 834, color: 'from-indigo-500 to-violet-500' },
                        { date: '10 ноя', channels: 612, color: 'from-indigo-400 to-violet-400' },
                        { date: '9 ноя', channels: 789, color: 'from-indigo-300 to-violet-300' },
                        { date: '8 ноя', channels: 543, color: 'from-indigo-200 to-violet-200' },
                      ].map((day, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="text-sm font-medium text-gray-600 w-16">{day.date}</div>
                          <div className="flex-1">
                            <div className={`h-8 rounded-lg bg-gradient-to-r ${day.color} flex items-center px-3`} style={{ width: `${(day.channels / 834) * 100}%` }}>
                              <span className="text-sm font-semibold text-white">{day.channels}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Icon name="Activity" size={20} className="text-indigo-600" />
                      Активные задачи
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockJobs.map((job) => (
                        <div key={job.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900">Задача #{job.id}</span>
                              <Badge variant={job.status === 'running' ? 'default' : job.status === 'failed' ? 'destructive' : 'secondary'}>
                                {job.status === 'running' ? 'выполняется' : job.status === 'failed' ? 'ошибка' : 'завершена'}
                              </Badge>
                            </div>
                            <span className="text-sm text-gray-600">{job.progress}%</span>
                          </div>
                          <Progress value={job.progress} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'scrape' && (
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Категория</label>
                      <Select defaultValue="marketing">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="marketing">Маркетинг и PR</SelectItem>
                          <SelectItem value="business">Бизнес</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Параллельность</label>
                      <Input type="number" defaultValue={6} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Использовать прокси</label>
                      <Select defaultValue="yes">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Да</SelectItem>
                          <SelectItem value="no">Нет</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">Пресеты</label>
                    <div className="flex gap-3">
                      <Button variant="outline" className="gap-2">
                        <Icon name="Zap" size={16} />
                        Быстрый
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Icon name="Database" size={16} />
                        Полный (все поля)
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Icon name="Camera" size={16} />
                        Снимок + Raw
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4 border-t flex justify-end gap-3">
                    <Button variant="outline">Сохранить пресет</Button>
                    <Button className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                      <Icon name="Play" size={16} />
                      Запустить полный скан
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'channels' && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">База каналов</CardTitle>
                  <div className="flex items-center gap-3">
                    <Input
                      placeholder="Поиск по названию, админу, тегу..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-80"
                    />
                    <div className="flex gap-2">
                      <Button 
                        className="gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
                        onClick={() => exportToExcel('xlsx')}
                      >
                        <Icon name="FileDown" size={16} />
                        Экспорт XLSX
                      </Button>
                      <Button 
                        variant="outline"
                        className="gap-2"
                        onClick={() => exportToExcel('csv')}
                      >
                        <Icon name="FileText" size={16} />
                        CSV
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Название</TableHead>
                      <TableHead>Подписчики</TableHead>
                      <TableHead>Категория</TableHead>
                      <TableHead>Админ</TableHead>
                      <TableHead>Проверен</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          Загрузка...
                        </TableCell>
                      </TableRow>
                    ) : channels.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          Каналов не найдено. Нажмите "Запустить полный скан" для загрузки данных.
                        </TableCell>
                      </TableRow>
                    ) : channels.map((channel) => (
                        <TableRow key={channel.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{channel.name}</TableCell>
                          <TableCell className="tabular-nums">{channel.subscribers.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{channel.category}</Badge>
                          </TableCell>
                          <TableCell className="text-gray-600">{channel.admin}</TableCell>
                          <TableCell className="text-gray-600 text-sm">{channel.lastChecked}</TableCell>
                          <TableCell>
                            <Badge variant={channel.status === 'active' ? 'default' : 'secondary'}>
                              {channel.status === 'active' ? 'активен' : 'неактивен'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="gap-1"
                              onClick={() => setSelectedChannel(channel)}
                            >
                              <Icon name="Eye" size={14} />
                              Просмотр
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {activeTab === 'jobs' && (
            <div className="space-y-4">
              {mockJobs.map((job) => (
                <Card key={job.id} className="border-0 shadow-sm">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-lg font-semibold text-gray-900">Задача #{job.id}</div>
                        <Badge variant={job.status === 'running' ? 'default' : job.status === 'failed' ? 'destructive' : 'secondary'}>
                          {job.status === 'running' ? 'выполняется' : job.status === 'failed' ? 'ошибка' : 'завершена'}
                        </Badge>
                        <span className="text-sm text-gray-600">{job.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {job.status === 'failed' && (
                          <Button size="sm" variant="outline" className="gap-2">
                            <Icon name="RotateCw" size={14} />
                            Повторить
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" className="gap-2">
                          <Icon name="Eye" size={14} />
                          Логи
                        </Button>
                      </div>
                    </div>
                    {job.status !== 'failed' && <Progress value={job.progress} className="h-2" />}
                    {job.status === 'failed' && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                        Ошибка: обнаружена капча на странице 47
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>

      <Dialog open={!!selectedChannel} onOpenChange={() => setSelectedChannel(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
                <Icon name="Radio" size={24} />
              </div>
              {selectedChannel?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedChannel && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Telegram-ссылка</div>
                  <a href={selectedChannel.tgLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-medium flex items-center gap-1">
                    {selectedChannel.slug}
                    <Icon name="ExternalLink" size={14} />
                  </a>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Администратор</div>
                  <div className="font-medium">{selectedChannel.admin}</div>
                </div>
              </div>

              <Separator />

              <div>
                <div className="text-sm text-gray-500 mb-2">Описание</div>
                <p className="text-gray-700 leading-relaxed">{selectedChannel.description}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Подписчики</div>
                  <div className="text-2xl font-bold text-gray-900 tabular-nums">{selectedChannel.subscribers.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Постов в день</div>
                  <div className="text-2xl font-bold text-gray-900 tabular-nums">{selectedChannel.postsPerDay}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Ср. просмотры</div>
                  <div className="text-2xl font-bold text-gray-900 tabular-nums">{selectedChannel.avgViews.toLocaleString()}</div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Язык</div>
                  <Badge variant="outline">{selectedChannel.language}</Badge>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Категория</div>
                  <Badge variant="outline">{selectedChannel.category}</Badge>
                </div>
              </div>

              <Separator />

              <div>
                <div className="text-sm text-gray-500 mb-2">Контакты</div>
                <div className="flex flex-wrap gap-2">
                  {selectedChannel.contacts.map((contact, idx) => (
                    <Badge key={idx} variant="secondary" className="gap-1">
                      <Icon name="Mail" size={12} />
                      {contact}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between pt-2">
                <div className="text-sm text-gray-500">
                  Последняя проверка: <span className="font-medium text-gray-900">{selectedChannel.lastChecked}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Icon name="RefreshCw" size={14} />
                    Пересобрать
                  </Button>
                  <Button 
                    size="sm" 
                    className="gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
                    onClick={() => exportToExcel('xlsx')}
                  >
                    <Icon name="FileDown" size={14} />
                    Экспорт
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}