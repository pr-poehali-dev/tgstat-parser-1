import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Icon from '@/components/ui/icon';

const mockChannels = [
  { id: 1, name: 'MarketingPro', subscribers: 120000, category: 'Маркетинг', admin: '@admin1', lastChecked: '2025-11-11', status: 'active' },
  { id: 2, name: 'PRinsider', subscribers: 45000, category: 'PR', admin: '@owner', lastChecked: '2025-11-10', status: 'active' },
  { id: 3, name: 'DigitalStrategy', subscribers: 89000, category: 'Маркетинг', admin: '@strategist', lastChecked: '2025-11-11', status: 'active' },
  { id: 4, name: 'BrandVoice', subscribers: 32000, category: 'PR', admin: '@brand_admin', lastChecked: '2025-11-09', status: 'inactive' },
];

const mockJobs = [
  { id: 231, name: 'Full Scan', status: 'running', progress: 67 },
  { id: 230, name: 'Re-scrape', status: 'failed', progress: 0 },
  { id: 229, name: 'Snapshot', status: 'completed', progress: 100 },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { label: 'Channels collected', value: '12,834', trend: '+234', icon: 'Database' },
    { label: 'Active jobs', value: '3', trend: 'Queue: Celery', icon: 'Activity' },
    { label: 'Failed (24h)', value: '2', trend: 'Alerts enabled', icon: 'AlertCircle', variant: 'destructive' },
    { label: 'Export ready', value: '5', trend: 'Last: 11 Nov', icon: 'FileDown' },
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
                <h1 className="text-lg font-semibold text-gray-900">TGStat Parser</h1>
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
              Dashboard
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
              Scrape Control
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
              Channels
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
              Jobs / Logs
            </button>
          </nav>

          <div className="mt-8 pt-6 border-t border-gray-200 space-y-3 text-sm">
            <div className="flex items-center justify-between text-gray-600">
              <span>Proxies</span>
              <span className="font-semibold text-gray-900">12</span>
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span>Queue length</span>
              <span className="font-semibold text-gray-900">4</span>
            </div>
            <div className="text-xs text-gray-500 pt-2">
              Last job: <span className="font-medium">11 Nov, 10:12</span>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-8">
          <header className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">
                {activeTab === 'dashboard' && 'Dashboard'}
                {activeTab === 'scrape' && 'Scrape Control'}
                {activeTab === 'channels' && 'Channels'}
                {activeTab === 'jobs' && 'Jobs & Logs'}
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
                Settings
              </Button>
              <Button className="gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-200">
                <Icon name="Play" size={16} />
                Start Full Scan
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
                        { date: '11 Nov', channels: 834, color: 'from-indigo-500 to-violet-500' },
                        { date: '10 Nov', channels: 612, color: 'from-indigo-400 to-violet-400' },
                        { date: '9 Nov', channels: 789, color: 'from-indigo-300 to-violet-300' },
                        { date: '8 Nov', channels: 543, color: 'from-indigo-200 to-violet-200' },
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
                              <span className="text-sm font-medium text-gray-900">Job #{job.id}</span>
                              <Badge variant={job.status === 'running' ? 'default' : job.status === 'failed' ? 'destructive' : 'secondary'}>
                                {job.status}
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
                      <label className="text-sm font-medium text-gray-700">Category</label>
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
                      <label className="text-sm font-medium text-gray-700">Concurrency</label>
                      <Input type="number" defaultValue={6} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Use proxies</label>
                      <Select defaultValue="yes">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">Presets</label>
                    <div className="flex gap-3">
                      <Button variant="outline" className="gap-2">
                        <Icon name="Zap" size={16} />
                        Fast
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Icon name="Database" size={16} />
                        Full (all fields)
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Icon name="Camera" size={16} />
                        Snapshot + Raw
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4 border-t flex justify-end gap-3">
                    <Button variant="outline">Save preset</Button>
                    <Button className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                      <Icon name="Play" size={16} />
                      Start Full Scan
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
                      placeholder="Search by name, admin, tag..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-80"
                    />
                    <Button className="gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700">
                      <Icon name="FileDown" size={16} />
                      Export XLSX
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Subscribers</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Admin</TableHead>
                      <TableHead>Last checked</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockChannels
                      .filter((ch) => ch.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((channel) => (
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
                              {channel.status}
                            </Badge>
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
                        <div className="text-lg font-semibold text-gray-900">Job #{job.id}</div>
                        <Badge variant={job.status === 'running' ? 'default' : job.status === 'failed' ? 'destructive' : 'secondary'}>
                          {job.status}
                        </Badge>
                        <span className="text-sm text-gray-600">{job.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {job.status === 'failed' && (
                          <Button size="sm" variant="outline" className="gap-2">
                            <Icon name="RotateCw" size={14} />
                            Retry
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" className="gap-2">
                          <Icon name="Eye" size={14} />
                          View logs
                        </Button>
                      </div>
                    </div>
                    {job.status !== 'failed' && <Progress value={job.progress} className="h-2" />}
                    {job.status === 'failed' && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                        Error: captcha detected at page 47
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
