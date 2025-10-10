interface PledgeNotificationData {
  serverName: string
  pledgerName: string
  pledgeAmount: number
  totalPledged: number
  monthlyGoal: number
  pledgerCount: number
  serverUrl: string
}

export async function sendPledgeNotification(
  webhookUrl: string,
  data: PledgeNotificationData
): Promise<boolean> {
  try {
    const progress = (data.totalPledged / data.monthlyGoal) * 100
    const remaining = Math.max(0, data.monthlyGoal - data.totalPledged)
    const isGoalReached = data.totalPledged >= data.monthlyGoal

    const embed = {
      title: `💰 New Pledge to ${data.serverName}`,
      description: `**${data.pledgerName}** has pledged **$${data.pledgeAmount.toFixed(2)}** to your server!`,
      color: isGoalReached ? 0x10b981 : 0x6366f1, // Green if goal reached, indigo otherwise
      fields: [
        {
          name: "💵 Pledge Amount",
          value: `$${data.pledgeAmount.toFixed(2)}`,
          inline: true
        },
        {
          name: "📊 Total Pledged",
          value: `$${data.totalPledged.toFixed(2)} / $${data.monthlyGoal.toFixed(2)}`,
          inline: true
        },
        {
          name: "👥 Pledgers",
          value: `${data.pledgerCount} ${data.pledgerCount === 1 ? 'person' : 'people'}`,
          inline: true
        },
        {
          name: "📈 Progress",
          value: `${progress.toFixed(1)}% funded`,
          inline: true
        },
        {
          name: "💸 Remaining",
          value: `$${remaining.toFixed(2)}`,
          inline: true
        },
        {
          name: "✨ Status",
          value: isGoalReached ? "🎉 Goal reached!" : "📍 In progress",
          inline: true
        }
      ],
      footer: {
        text: "communitypledges.com • Real-time notifications",
        icon_url: "https://communitypledges.com/favicon.ico"
      },
      timestamp: new Date().toISOString(),
      url: data.serverUrl
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [embed]
      })
    })

    if (!response.ok) {
      console.error('Discord webhook failed:', response.status, response.statusText)
      return false
    }

    return true
  } catch (error) {
    console.error('Error sending Discord webhook:', error)
    return false
  }
}

export async function sendPledgeUpdateNotification(
  webhookUrl: string,
  data: PledgeNotificationData & { oldAmount: number }
): Promise<boolean> {
  try {
    const progress = (data.totalPledged / data.monthlyGoal) * 100
    const remaining = Math.max(0, data.monthlyGoal - data.totalPledged)
    const isGoalReached = data.totalPledged >= data.monthlyGoal
    const amountChange = data.pledgeAmount - data.oldAmount
    const changeText = amountChange > 0 
      ? `increased by $${amountChange.toFixed(2)}` 
      : `decreased by $${Math.abs(amountChange).toFixed(2)}`

    const embed = {
      title: `🔄 Pledge Updated for ${data.serverName}`,
      description: `**${data.pledgerName}** ${changeText} their pledge!\nNew amount: **$${data.pledgeAmount.toFixed(2)}**`,
      color: isGoalReached ? 0x10b981 : 0xf59e0b, // Green if goal reached, amber for update
      fields: [
        {
          name: "💵 New Pledge Amount",
          value: `$${data.pledgeAmount.toFixed(2)}`,
          inline: true
        },
        {
          name: "📊 Total Pledged",
          value: `$${data.totalPledged.toFixed(2)} / $${data.monthlyGoal.toFixed(2)}`,
          inline: true
        },
        {
          name: "👥 Pledgers",
          value: `${data.pledgerCount} ${data.pledgerCount === 1 ? 'person' : 'people'}`,
          inline: true
        },
        {
          name: "📈 Progress",
          value: `${progress.toFixed(1)}% funded`,
          inline: true
        },
        {
          name: "💸 Remaining",
          value: `$${remaining.toFixed(2)}`,
          inline: true
        },
        {
          name: "✨ Status",
          value: isGoalReached ? "🎉 Goal reached!" : "📍 In progress",
          inline: true
        }
      ],
      footer: {
        text: "communitypledges.com • Real-time notifications",
        icon_url: "https://communitypledges.com/favicon.ico"
      },
      timestamp: new Date().toISOString(),
      url: data.serverUrl
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [embed]
      })
    })

    if (!response.ok) {
      console.error('Discord webhook failed:', response.status, response.statusText)
      return false
    }

    return true
  } catch (error) {
    console.error('Error sending Discord webhook:', error)
    return false
  }
}

export async function sendPledgeCancelNotification(
  webhookUrl: string,
  data: Omit<PledgeNotificationData, 'pledgeAmount'>
): Promise<boolean> {
  try {
    const progress = (data.totalPledged / data.monthlyGoal) * 100
    const remaining = Math.max(0, data.monthlyGoal - data.totalPledged)

    const embed = {
      title: `❌ Pledge Cancelled for ${data.serverName}`,
      description: `**${data.pledgerName}** has cancelled their pledge.`,
      color: 0xef4444, // Red for cancellation
      fields: [
        {
          name: "📊 Total Pledged",
          value: `$${data.totalPledged.toFixed(2)} / $${data.monthlyGoal.toFixed(2)}`,
          inline: true
        },
        {
          name: "👥 Pledgers",
          value: `${data.pledgerCount} ${data.pledgerCount === 1 ? 'person' : 'people'}`,
          inline: true
        },
        {
          name: "📈 Progress",
          value: `${progress.toFixed(1)}% funded`,
          inline: true
        },
        {
          name: "💸 Remaining",
          value: `$${remaining.toFixed(2)}`,
          inline: true
        }
      ],
      footer: {
        text: "communitypledges.com • Real-time notifications",
        icon_url: "https://communitypledges.com/favicon.ico"
      },
      timestamp: new Date().toISOString(),
      url: data.serverUrl
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [embed]
      })
    })

    if (!response.ok) {
      console.error('Discord webhook failed:', response.status, response.statusText)
      return false
    }

    return true
  } catch (error) {
    console.error('Error sending Discord webhook:', error)
    return false
  }
}

