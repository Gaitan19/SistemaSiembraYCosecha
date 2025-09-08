using Microsoft.AspNetCore.SignalR;

namespace ReactVentas.Hubs
{
    public class NotificationHub : Hub
    {
        public async Task JoinGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        }

        public async Task LeaveGroup(string groupName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        }

        public override async Task OnConnectedAsync()
        {
            // Join the default group for real-time notifications
            await Groups.AddToGroupAsync(Context.ConnectionId, "FerreteriaSistema");
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            // Clean up when client disconnects
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, "FerreteriaSistema");
            await base.OnDisconnectedAsync(exception);
        }
    }
}