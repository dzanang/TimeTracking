﻿using Database;
using System.Collections.Generic;
using System.Linq;
using WebAPI.Services;
using WebAPI.Helpers;
using WebAPI.Models;
using System;

namespace WebAPI.Controllers
{
    public class ListTeamController : BaseController<Team>
    {
        SchoolIdentity ident = new SchoolIdentity();

        public ListTeamController(Repository<Team> depo) : base(depo)
        { }

        public IList<ListTeamsModel> Get()
        {
            var teams = Repository.Get().OrderBy(x => x.Name)
                        .ToList();

            List<ListTeamsModel> list = new List<ListTeamsModel>();
            foreach (var t in teams)
            {
                foreach (var day in t.Details.ToList())
                {

                    if (day.Day.Date.Month != DateTime.Now.Month)//making the default landing page api/listteam to refer to current month
                        t.Details.Remove(day);

                }
                list.Add(ListTeams.Create(t, DateTime.Now.Month));
            }
            return list;
        }

        public IList<ListTeamsModel> GetByMonth(int month)
        {


            var teams = Repository.Get().OrderBy(x => x.Name)
                   .ToList();
            
            List<ListTeamsModel> list = new List<ListTeamsModel>();
            foreach (var t in teams)
            {
                foreach (var day in t.Details.ToList())  //making sure only details included into the month we have forwarded are included, and everthying
                 {                                       //else is hidden
                    if (day.Day.Date.Month != month)

                    {
                        t.Details.Remove(day);
                    }
                }
                list.Add(ListTeams.Create(t, month));

            }
            return list;          
        }
    }
}

