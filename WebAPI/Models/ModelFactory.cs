﻿using Database;
using WebAPI.Models;
using WebAPI.Controllers;

namespace WebAPI.Models
{
    public class ModelFactory
    {
        public TeamModel Create(Team team)
        {
            TeamModel model = new TeamModel()
            {
                Id = team.Id,
                Name = team.Name,
                Description = team.Description,
                Type = team.Type.ToString()
            };
            foreach (var person in team.Roles)
            {
                model.Members.Add(new MemberModel() { Name = person.Person.FirstName + " " + person.Person.LastName, Role = person.Role.Name });
            }
            return model;
        }

        public RoleModel Create(Role role)
        {
            return new RoleModel()
            {
                Id = role.Id,
                Name = role.Name,
                Count = role.Roles.Count
            };
        }

        public EngagementModel Create(Engagement engagement)
        {
            return new EngagementModel()
            {
                Id = engagement.Id,              
                Person = engagement.Person.Id,
                PersonName = engagement.Person.FirstName + " " + engagement.Person.LastName,
                Team = engagement.Team.Id,
                TeamName = engagement.Team.Name,
                Role = engagement.Role.Id,
                RoleName = engagement.Role.Name
            };
        }


        public DayModel Create(Day day)
        {
            DayModel model = new DayModel()
            {
                Id = day.Id,
                Person = day.Person.Id,
                PersonName = day.Person.FirstName + " " + day.Person.LastName,
                Date = day.Date,
                WorkTime = day.WorkTime,
                PtoTime = day.PtoTime,
                EntryStatus = day.EntryStatus
            };
            foreach (var detail in day.Details)
            {
                model.Details.Add(new DetailModel() {Id= detail.Id, WorkTime = detail.WorkTime, Description = detail.Description, TeamName = detail.Team.Name, Date = detail.Day.Date });
            }
            return model;
        }
        public DetailModel Create(Detail detail)
        {
            return new DetailModel()
            {
                Id = detail.Id,
                Day = detail.Day.Id,

                Date = detail.Day.Date,


                Person = detail.Day.Person.Id,
                PersonName = detail.Day.Person.FirstName,
                WorkTime = detail.WorkTime,
                //BillTime = detail.BillTime,
                Description = detail.Description,
                Team = detail.Team.Id,
                TeamName = detail.Team.Name
            };
        }

        public PersonModel Create(Person person)
        {
            return new PersonModel()
            {
                Id = person.Id,
                FirstName = person.FirstName,
                LastName = person.LastName,
                Category = person.Category,
                Status = person.Status,
                Email = person.Email,               
            };
        }
        public TokenModel Create(AuthToken token)
        {
            return new TokenModel()
            {
                Token = token.Token,
                Expiration = token.Expiration
            };
        }
        
    }
}